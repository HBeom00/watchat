import SignInForm from '@/components/auth/SignInForm';
import SocialLogin from '@/components/auth/SocialLogin';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="mt-[100px] flex flex-col justify-center items-center">
      <p className="w-[340px] px-2 py-4 flex justify-center items-center gap-2 title-m text-center text-Grey-900">
        로그인
      </p>
      <SignInForm />
      <SocialLogin />
      <Link href={'/signup'}>회원가입</Link>
    </div>
  );
};

export default LoginPage;
