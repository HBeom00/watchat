'use client';

import browserClient from '@/utils/supabase/client';
import { useEffect } from 'react';

const GoogleLogin = () => {
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
    <button onClick={signInWithGoogle} className="border-black border-2 border-solid p-2 w-[10%]">
      구글 로그인
    </button>
  );
};

export default GoogleLogin;
