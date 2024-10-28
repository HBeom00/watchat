'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import browserClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/providers/userStoreProvider';
import { useState } from 'react';
import { IoEyeOffOutline } from 'react-icons/io5';
import { IoEyeOutline } from 'react-icons/io5';

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 border-solid border-2 border-black">
        <label>이메일</label>
        <input type="email" {...register('email')} placeholder="이메일(example@gmail.com)" />
        {formState.errors.email && <span className="text-red-600">{formState.errors.email.message}</span>}

        <div>
          <label>비밀번호</label>
          <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="비밀번호" />
          {formState.errors.password && <span className="text-red-600">{formState.errors.password.message}</span>}
          <button type="button" onClick={onPasswordVisibility}>
            {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
          </button>
        </div>

        <button className="w-[10%]">로그인</button>
      </div>
    </form>
  );
};

export default SignInForm;
