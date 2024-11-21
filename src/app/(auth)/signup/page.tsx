import SignUpForm from '@/components/auth/SignUpForm';
import { Metadata } from 'next';

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
        <p className="px-[8px] py-[16px] mb-[16px] flex justify-center items-center gap-[8px] self-stretch title-m text-center text-Grey-900">
          회원가입
        </p>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
