'use client';

import browserClient from '@/utils/supabase/client';
import { useEffect } from 'react';
import Google_Image from '../../../public/google.svg';
import Image from 'next/image';

const GoogleButton = () => {
  useEffect(() => {
    browserClient.auth.getSession().then(console.log);
  }, []);

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
      className="flex gap-2 w-[340px] px-6 py-4 justify-center items-center self-stretch rounded-lg border border-solid border-Grey-200 bg-white body-m-bold"
    >
      <Image src={Google_Image} alt="Google_Image" width={16} height={16} />
      <p>Google 로그인</p>
    </button>
  );
};

export default GoogleButton;
