import SignUpForm from '@/components/auth/SignUpForm';
import React from 'react';

const SignUpPage = () => {
  return (
    <div className="mt-[108.56px] flex flex-col justify-center items-center">
      <p className="title-m mb-[57.94px] text-center">회원가입</p>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
