'use client';

import browserClient from '@/utils/supabase/client';

const KakaoLogin = () => {
  const signInWithKakao = async () => {
    await browserClient.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        queryParams: {
          prompt: 'select_account'
        },
        redirectTo: window.origin + '/auth/callback'
      }
    });
  };

  return (
    <button onClick={signInWithKakao} className="border-black border-2 border-solid p-2 w-[10%]">
      카카오 로그인
    </button>
  );
};

export default KakaoLogin;
