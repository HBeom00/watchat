'use client';

import GoogleButton from '../button/GoogleButton';
import KakaoButton from '../button/KakaoButton';

const SocialLogin = () => {
  return (
    <div className="flex flex-col gap-[16px] mb-[16px]">
      <GoogleButton />
      <KakaoButton />
    </div>
  );
};

export default SocialLogin;
