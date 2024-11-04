'use client';

import browserClient from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { IoEyeOffOutline } from 'react-icons/io5';
import { IoEyeOutline } from 'react-icons/io5';

const signInSchema = z
  .object({
    email: z.string().email({ message: '이메일 형식을 확인해주세요' }),
    password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/, {
      message: '8~16자의 영문,숫자,특수문자를 모두 포함한 비밀번호를 입력해주세요'
    }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword']
  });

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    resolver: zodResolver(signInSchema)
  });

  const onSubmit = async (userInfo: FieldValues) => {
    const { error } = await browserClient.auth.signUp({
      email: userInfo.email,
      password: userInfo.password
    });

    if (error) {
      alert('이미 존재하는 아이디입니다.');
      return;
    }

    await browserClient.auth.signOut();

    alert('회원가입 되었습니다.');
    router.push('/login');
  };

  const onPasswordVisibility = () => setShowPassword((prev) => !prev);
  const onConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="w-[340px] flex flex-col justify-center items-center gap-2">
          <label className="commonLabel">
            이메일<span className="commonEssential">*</span>
          </label>
          <input type="email" {...register('email')} placeholder="예) example@gmail.com" className="commonInput" />
          {formState.errors.email && <p className="commonHelpText">{formState.errors.email.message}</p>}
        </div>

        <div>
          <label>비밀번호</label>
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="특수문자, 영문, 숫자 조합 8~16자"
          />
          {formState.errors.password && <span className="text-red-600">{formState.errors.password.message}</span>}
          <button type="button" onClick={onPasswordVisibility}>
            {showPassword ? <IoEyeOutline className="w-6 h-6" /> : <IoEyeOffOutline className="w-6 h-6" />}
          </button>
        </div>

        <div>
          <label>비밀번호 확인</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            placeholder="비밀번호 재입력"
          />
          {formState.errors.confirmPassword && (
            <span className="text-red-600">{formState.errors.confirmPassword.message}</span>
          )}
          <button type="button" onClick={onConfirmPasswordVisibility}>
            {showConfirmPassword ? <IoEyeOutline className="w-6 h-6" /> : <IoEyeOffOutline className="w-6 h-6" />}
          </button>
        </div>

        <button>가입하기</button>
      </div>
    </form>
  );
};

export default SignUpForm;
