'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import browserClient from '@/utils/supabase/client';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog';

// 유효성 검사
const signInSchema = z.object({
  email: z.string().email({ message: '이메일 주소에 @를 포함해주세요.' }),
  password: z.string().min(8, { message: '비밀번호를 입력해주세요' })
});

const SignInForm = () => {
  const route = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const { register, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(signInSchema)
  });

  // 로그인 버튼 클릭 시, 실행
  const { mutateAsync: loginBtn } = useMutation({
    mutationFn: async (userInfo: FieldValues) => {
      const { error } = await browserClient.auth.signInWithPassword({
        email: userInfo.email,
        password: userInfo.password
      });

      if (error) {
        setShowErrorModal(true);
        return;
      }

      route.push('/');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userId'] });
    }
  });

  // 로그인 버튼 클릭
  const onSubmit = async (userInfo: FieldValues) => {
    loginBtn(userInfo);
  };

  // 비밀번호 type 속성 변경
  const onPasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-start gap-[16px] self-stretch">
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
                <Image src="/visibility.svg" alt="visibility" width={24} height={24} className="w-6 h-6" />
              ) : (
                <Image src="/visibility_off.svg" alt="visibility_off" width={24} height={24} className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      <button
        disabled={!formState.isValid}
        className={
          !formState.isValid
            ? 'disabled-btn-xl w-[340px] flex justify-center items-center mt-[48px]'
            : 'btn-xl w-[340px] flex justify-center items-center mt-[48px]'
        }
      >
        로그인
      </button>

      {showErrorModal && (
        <Dialog open={showErrorModal} onOpenChange={(isOpen) => setShowErrorModal(isOpen)}>
          <DialogContent className="w-[340px] p-0 gap-0 rounded-[8px] bg-static-white">
            <DialogHeader className="flex py-6">
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-[8px] pb-[16px] w-full justify-center items-center border-solid border-Grey-200 border-b-[1px]">
              <p className="self-stretch pt-[16px] pb-[20px] text-center body-m text-static-black">
                아이디와 비밀번호를 확인해주세요.
              </p>
            </div>
            <p
              onClick={() => setShowErrorModal(false)}
              className="outline-btn-l flex py-[12px] px-[20px] justify-center items-center gap-[4px] self-stretch rounded-[8px] border-none text-primary-400 body-m-bold"
            >
              확인
            </p>
            <DialogDescription></DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </form>
  );
};

export default SignInForm;
