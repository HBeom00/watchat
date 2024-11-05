'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import browserClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/providers/userStoreProvider';
import { useState } from 'react';
import Image from 'next/image';
import visibility from '../../../public/visibility.svg';
import visibility_off from '../../../public/visibility_off.svg';

const signInSchema = z.object({
  email: z.string().email({ message: '이메일 형식을 확인해주세요' }),
  password: z.string().min(8, { message: '비밀번호를 입력해주세요' })
});

const SignInForm = () => {
  const { userLogin } = useUserStore((state) => state);
  const [showPassword, setShowPassword] = useState(false);
  const route = useRouter();
  const { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(signInSchema)
  });

  // 로그인 버튼 클릭 시
  const onSubmit = async (userInfo: FieldValues) => {
    const { data: session, error } = await browserClient.auth.signInWithPassword({
      email: userInfo.email,
      password: userInfo.password
    });

    if (error) {
      alert('아이디와 비밀번호를 다시 입력해주세요.');
      return;
    }

    const userId = session?.user?.id;

    if (userId) {
      const { data: user, error: userFetchError } = await browserClient.from('user').select('*').eq('user_id', userId);

      if (userFetchError) {
        console.error('유저 확인 오류:', userFetchError.message);
        alert('사용자 확인 중 오류가 발생했습니다.');
        return;
      }

      userLogin();

      if (user.length !== 1) {
        route.push('/firstLogin');
      } else {
        route.push('/');
      }
    } else {
      alert('로그인 세션이 유효하지 않습니다.');
    }
  };

  const onPasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 mb-4">
      <div className="w-[340px] flex flex-col items-start gap-4 mb-12">
        <div className="inputDiv">
          <label className="commonLabel">이메일</label>
          <input
            type="email"
            {...register('email')}
            placeholder="이메일(example@gmail.com)"
            className="commonEmailInput"
          />
          {formState.errors.email && <p className="commonHelpText">{formState.errors.email.message}</p>}
        </div>

        <div className="inputDiv">
          <label className="commonLabel">비밀번호</label>
          <div className="w-full relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder="비밀번호"
              className="w-full commonPasswordInput"
            />
            <button
              type="button"
              onClick={onPasswordVisibility}
              className="absolute top-2/4 -translate-y-1/2 right-[5%]"
            >
              {showPassword ? (
                <Image src={visibility} alt={visibility} width={24} height={24} className="w-6 h-6" />
              ) : (
                <Image src={visibility_off} alt={visibility_off} width={24} height={24} className="w-6 h-6" />
              )}
            </button>
          </div>
          {formState.errors.password && <p className="commonHelpText">{formState.errors.password.message}</p>}
        </div>
      </div>
      <button
        disabled={!formState.isValid}
        className={
          !formState.isValid
            ? 'disabled-btn-xl w-[340px] flex justify-center items-center'
            : 'btn-xl w-[340px] flex justify-center items-center'
        }
      >
        로그인
      </button>
    </form>
  );
};

export default SignInForm;
