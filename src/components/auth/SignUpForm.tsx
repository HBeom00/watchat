'use client';

import browserClient from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';

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

    alert('회원가입 되었습니다.');
    router.push('/login');
    return;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4 border-solid border-2 border-black">
        <label>이메일</label>
        <input type="email" {...register('email')} placeholder="예) example@gmail.com" />
        {formState.errors.email && <span className="text-red-600">{formState.errors.email.message}</span>}

        <label>비밀번호</label>
        <input type="password" {...register('password')} placeholder="특수문자, 영문, 숫자 조합 8~16자" />
        {formState.errors.password && <span className="text-red-600">{formState.errors.password.message}</span>}

        <label>비밀번호 확인</label>
        <input type="password" {...register('confirmPassword')} placeholder="비밀번호 재입력" />
        {formState.errors.confirmPassword && (
          <span className="text-red-600">{formState.errors.confirmPassword.message}</span>
        )}

        <button>가입하기</button>
      </div>
    </form>
  );
};

export default SignUpForm;
