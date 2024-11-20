'use client';

import { useFetchUserData, useFetchUserId } from '@/store/userStore';
import React from 'react';
import { usePathname } from 'next/navigation';
import { ViewHostedParty } from '@/components/mypage/ViewMoreOwnerParty';

const MyOwnerParty = () => {
  const pathname = usePathname();
  // 사용자 데이터 가져오기

  // 마이페이지인경우의 데이터 가져오기
  const { data: userData } = useFetchUserData();

  const fetchedUserId = useFetchUserId();

  const userId = pathname === '/my-page' ? userData?.user_id || '' : fetchedUserId || '';

  if (!userId) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return <ViewHostedParty userId={userId} />;
};

export default MyOwnerParty;
