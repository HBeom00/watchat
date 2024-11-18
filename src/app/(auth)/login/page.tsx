import SignInForm from '@/components/auth/SignInForm';
import SocialLogin from '@/components/auth/SocialLogin';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '로그인',
  description: '로그인 페이지'
};

const LoginPage = () => {
  return (
    <div
      className={`flex justify-center items-center mt-[100px] 
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
        <div className="flex flex-col items-start gap-[32px] self-stretch">
          <p className=" px-[8px] py-[16px] flex justify-center items-center gap-[8px] self-stretch title-m text-center text-Grey-900">
            로그인
          </p>
          <SignInForm />
        </div>
        <div>
          <SocialLogin />
          <Link
            href={'/signup'}
            className="flex px-[8px] py-[16px] justify-center items-center self-stretch gap-[8px] body-m-bold text-Grey-400"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
