'use client';

import browserClient from '@/utils/supabase/client';
import Image from 'next/image';
import Kakao_Image from '../../../public/kakao.svg';

const KakaoButton = () => {
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
    <button
      onClick={signInWithKakao}
      className="flex gap-2 w-[340px] px-6 py-4 justify-center items-center self-stretch rounded-lg bg-[#FAE64C] body-m-bold"
    >
      <Image src={Kakao_Image} alt="Kakao_Image" width={16} height={16} />
      <p>Kakao 로그인</p>
    </button>
  );
};

export default KakaoButton;
