'use client';

import GoogleLogin from '../button/GoogleLogin';
import KakaoLogin from '../button/KakaoLogin';

const SocialLogin = () => {
  return (
    <div className="flex flex-col gap-2">
      <KakaoLogin />
      <GoogleLogin />
    </div>
  );
};

export default SocialLogin;
