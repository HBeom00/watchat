'use client';

import { getUserId } from '@/utils/getUserId';
import { partySituationChecker } from '@/utils/memberCheck';
import browserClient from '@/utils/supabase/client';
// import { useRouter } from "next/navigation";
import { useState } from 'react';

const ParticipationForm = ({ partyId }: { partyId: string }) => {
  const [profile_image, setProfile_image] = useState('');
  const [nickname, setNickname] = useState('');
  // const router = useRouter()

  // 참가하기 함수
  const submitHandler = async () => {
    const userId = await getUserId();

    // 파티 상태 확인하기
    const endCheck = await partySituationChecker(partyId);
    if (endCheck === '알수없음') {
      alert('존재하지 않는 파티입니다');
      return;
    } else if (endCheck === '모집마감') {
      alert('모집이 마감된 파티입니다');
      return;
    } else if (endCheck === '종료') {
      alert('종료된 파티입니다');
      return;
    }

    // 참가하기
    const { data, error } = await browserClient
      .from('team_user_profile')
      .insert({ nickname, profile_image, party_id: partyId, user_id: userId });
    console.log(data, error);
    // if(error){
    //   alert('파티에 참가할 수 없습니다')
    // }
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
