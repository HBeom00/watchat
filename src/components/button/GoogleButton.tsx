'use client';

import Image from 'next/image';
import browserClient from '@/utils/supabase/client';
import Google_Image from '../../../public/google.svg';

const GoogleButton = () => {
  const signInWithGoogle = async () => {
    await browserClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        },
        redirectTo: window.origin + '/auth/callback'
      }
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="flex gap-[8px] w-[340px] px-[24px] py-[16px] justify-center items-center self-stretch rounded-lg border border-solid border-Grey-200 bg-white"
    >
      <Image src={Google_Image} alt="Google_Image" width={16} height={16} className="w-[16px] h-[16px]" />
      <p className="body-m-bold">Google 로그인</p>
    </button>
  );
};

export default GoogleButton;
