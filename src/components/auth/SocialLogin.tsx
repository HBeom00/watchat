'use client';

import GoogleButton from '../button/GoogleButton';
import KakaoButton from '../button/KakaoButton';

const SocialLogin = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <GoogleButton />
      <KakaoButton />
    </div>
  );
};

export default SocialLogin;
