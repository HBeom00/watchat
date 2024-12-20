'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { randomNickname } from '@/constants/randomName';
import browserClient from '@/utils/supabase/client';
import Image from 'next/image';

// 유효성 검사
const signInSchema = z
  .object({
    email: z.string().email({ message: '이메일 주소에 @를 포함해주세요.' }),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/, {
      message: '8~16자의 영문, 숫자, 특수문자를 모두 포함하여 입력해주세요.'
    }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword']
  });

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    resolver: zodResolver(signInSchema)
  });

  // 랜덤 닉네임 받아오기
  const randomname = randomNickname();

  // 가입 버튼 클릭 시
  const onSubmit = async (userInfo: FieldValues) => {
    const { error } = await browserClient.auth.signUp({
      email: userInfo.email,
      password: userInfo.password,
      options: {
        data: {
          profile_img:
            'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/default_profile.png',
          nickname: randomname
        }
      }
    });

    if (error) {
      // 이메일 input 아래에 메시지를 표시하도록 react-hook-form의 setError 사용
      setError('email', { type: 'server', message: '이미 존재하는 아이디입니다.' });
      return;
    }

    // 회원가입 시, 들어오는 쿠키 값 삭제
    await browserClient.auth.signOut();

    alert('회원가입 되었습니다.');
    router.push('/login');
  };

  // 비밀번호 type 속성 변경
  const onPasswordVisibility = () => setShowPassword((prev) => !prev);
  const onConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start gap-[16px] self-stretch">
      <div className="inputDiv">
        <label className="commonLabel">
          이메일<span className="commonEssential">*</span>
        </label>
        <input type="email" {...register('email')} placeholder="예) example@gmail.com" className="commonEmailInput" />
        {/* 이메일 필드 아래 유효성 검사 및 서버 에러 메시지 표시 */}
        {formState.errors.email && <p className="commonHelpText">{formState.errors.email.message}</p>}
      </div>

      <div className="inputDiv">
        <label className="commonLabel">
          비밀번호<span className="commonEssential">*</span>
        </label>
        <div className="w-full relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="특수문자, 영문, 숫자 조합 8~16자"
            className="w-full commonPasswordInput"
          />
          <button type="button" onClick={onPasswordVisibility} className="absolute top-2/4 -translate-y-1/2 right-[5%]">
            {showPassword ? (
              <Image src="/visibility.svg" alt="비밀번호 보이기" width={24} height={24} className="w-[24px] h-[24px]" />
            ) : (
              <Image
                src="/visibility_off.svg"
                alt="비밀번호 숨기기"
                width={24}
                height={24}
                className="w-[24px] h-[24px]"
              />
            )}
          </button>
        </div>
        {formState.errors.password && <p className="commonHelpText">{formState.errors.password.message}</p>}
      </div>

      <div className="inputDiv">
        <div className="w-full relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            placeholder="비밀번호를 다시 한 번 입력해주세요."
            className="w-full commonPasswordInput"
          />
          <button
            type="button"
            onClick={onConfirmPasswordVisibility}
            className="absolute top-2/4 -translate-y-1/2 right-[5%]"
          >
            {showConfirmPassword ? (
              <Image src="/visibility.svg" alt="비밀번호 보이기" width={24} height={24} className="w-[24px] h-[24px]" />
            ) : (
              <Image
                src="/visibility_off.svg"
                alt="비밀번호 숨기기"
                width={24}
                height={24}
                className="w-[24px] h-[24px]"
              />
            )}
          </button>
        </div>
        {formState.errors.confirmPassword && (
          <p className="commonHelpText">{formState.errors.confirmPassword.message}</p>
        )}
      </div>

      <button className="btn-xl w-[340px] flex justify-center items-center gap-[4px] mt-[50px]">가입하기</button>
    </form>
  );
};

export default SignUpForm;
