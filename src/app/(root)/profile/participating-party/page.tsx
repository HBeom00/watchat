'use client';

import React from 'react';
import { ViewMoreParticipatingParty } from '@/components/mypage/ViewMoreParticipatingParty';
import { usePathname } from 'next/navigation';

export type platform = {
  logoUrl: string;
  name: string;
};

const ParticipatingParty = () => {
  // 사용자 데이터 가져오기

  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const userId = pathSegments.includes('profile') ? pathSegments[pathSegments.indexOf('profile') + 1] : undefined;

  if (!userId) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }
  return <ViewMoreParticipatingParty userId={userId} />;
};

export default ParticipatingParty;
