'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { randomNickname } from '@/utils/randomName';
import browserClient from '@/utils/supabase/client';
import Image from 'next/image';
import visibility from '../../../public/visibility.svg';
import visibility_off from '../../../public/visibility_off.svg';

// 유효성 검사
const signInSchema = z
  .object({
    email: z.string().email({ message: '이메일 형식을 확인해주세요.' }),
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
  const { register, handleSubmit, formState } = useForm({
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
      alert('이미 존재하는 아이디입니다.');
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start gap-4 self-stretch">
      <div className="inputDiv">
        <label className="commonLabel">
          이메일<span className="commonEssential">*</span>
        </label>
        <input type="email" {...register('email')} placeholder="예) example@gmail.com" className="commonEmailInput" />
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
              <Image src={visibility} alt={visibility} width={24} height={24} className="w-6 h-6" />
            ) : (
              <Image src={visibility_off} alt={visibility_off} width={24} height={24} className="w-6 h-6" />
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
              <Image src={visibility} alt={visibility} width={24} height={24} className="w-6 h-6" />
            ) : (
              <Image src={visibility_off} alt={visibility_off} width={24} height={24} className="w-6 h-6" />
            )}
          </button>
        </div>
        {formState.errors.confirmPassword && (
          <p className="commonHelpText">{formState.errors.confirmPassword.message}</p>
        )}
      </div>
      <button className="btn-xl w-[340px] flex justify-center items-center gap-1 mt-[50px]">가입하기</button>
    </form>
  );
};

export default SignUpForm;
