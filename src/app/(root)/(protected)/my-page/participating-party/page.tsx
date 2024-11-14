'use client';

import { useFetchUserData } from '@/store/userStore';
import React from 'react';
import { ViewMoreParticipatingParty } from '@/components/mypage/ViewMoreParticipatingParty';

const ParticipatingParty = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();

  const userId = userData?.user_id ?? '';

  if (isPending) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || !userId) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return <ViewMoreParticipatingParty userId={userId} />;
};

export default ParticipatingParty;
