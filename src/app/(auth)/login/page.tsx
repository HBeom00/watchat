import SignInForm from '@/components/auth/SignInForm';
import SocialLogin from '@/components/auth/SocialLogin';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '로그인',
  description: '로그인 페이지'
};

const LoginPage = () => {
  return (
    <div className="mt-[100px] flex justify-center items-center">
      <div className="w-[340px] flex flex-col items-start gap-[16px]">
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
