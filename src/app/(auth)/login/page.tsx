import SignInForm from '@/components/auth/SignInForm';
import SocialLogin from '@/components/auth/SocialLogin';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div>
      <h1>로그인</h1>
      <SignInForm />
      <SocialLogin />
      <Link href={'/signup'}>회원가입</Link>
    </div>
  );
};

export default LoginPage;
