import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: '회원가입',
  description: '회원가입 페이지'
};

const SignUpPage = () => {
  return (
    <div className="mt-[100px] flex justify-center items-center">
      <div className="w-[340px] flex flex-col items-start gap-8">
        <p className="px-2 py-4 flex justify-center items-center gap-2 self-stretch title-m text-center text-Grey-900">
          회원가입
        </p>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
