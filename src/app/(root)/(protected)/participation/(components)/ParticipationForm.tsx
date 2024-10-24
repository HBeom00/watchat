'use client';

import browserClient from '@/utils/supabase/client';
// import { useRouter } from "next/navigation";
import { useState } from 'react';

import React from 'react';

const ParticipationForm = (partyId: { partyId: string }) => {
  const [profile_image, setProfile_image] = useState('');
  const [nickname, setNickname] = useState('');
  // const router = useRouter()
  const userId = '로그인한 유저정보 들어갈 곳';

  // 참가하기 함수
  const submitHandler = async () => {
    const { data, error } = await browserClient
      .from('team_user_profile')
      .insert({ nickname, profile_image, party_id: partyId, user_id: userId });
    // if(error){
    //   throw new Error(error.message)
    // }
    console.log(data, error);
    // if(data){
    //   router.replace(`/party/${partyId}`)
    // }
  };
  return (
    <>
      <div className="flex flex-col gap-10 p-10 bg-red-300">
        <input onChange={(e) => setProfile_image(e.target.value)} placeholder="이미지를 입력하세요" />
        <input onChange={(e) => setNickname(e.target.value)} placeholder="닉네임을 입력하세요" />
      </div>
      <button onClick={submitHandler} className="bg-blue-300 rounded-2xl">
        참가하기!!
      </button>
    </>
  );
};

export default ParticipationForm;
