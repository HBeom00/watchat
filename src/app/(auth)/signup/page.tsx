import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: '회원가입',
  description: '회원가입 페이지'
};

const SignUpPage = () => {
  return (
    <div
      className={`mt-[100px] flex justify-center items-center
      mobile:mt-0
    `}
    >
      <div className="w-[340px] flex flex-col items-start gap-[16px]">
        <Link
          href={'/'}
          className={`
            mobile_row: hidden
            mobile:w-full mobile:flex mobile:justify-end mobile:items-center mobile:mt-[20px]
            `}
        >
          <Image src="/close.svg" alt="close_img" width={24} height={24} />
        </Link>
        <p className="px-[8px] py-[16px] mb-[16px] flex justify-center items-center gap-[8px] self-stretch title-m text-center text-Grey-900">
          회원가입
        </p>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
