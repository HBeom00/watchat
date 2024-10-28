'use client';

import { useState } from 'react';
import { partyInfo } from '../page';
import DetailInfo from './DetailInfo';
import MemberList from './MemberList';
import InvitedButton from './InvitedButton';
import { isMemberExist } from '@/utils/memberCheck';
import { useQuery } from '@tanstack/react-query';

const PartyBottom = ({ partyData, userId }: { partyData: partyInfo; userId: string | null }) => {
  const [tab, setTab] = useState<string>('파티소개');

  //로그인한 사용자가 해당 파티에 가입했을 때
  const { data: isMember, isLoading } = useQuery({
    queryKey: ['isMember', partyData.party_id],
    queryFn: async () => await isMemberExist(partyData.party_id, userId)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10 w-full justify-center items-center bg-slate-400">
      {/* 누르면 내가 팔로우한 유저들이 표시되고 그 중에서 초대할 수 있음 */}
      {userId && isMember ? <InvitedButton partyNumber={partyData.party_id} userId={userId} /> : <></>}

      <div className="flex flex-row gap-10">
        <button onClick={() => setTab('파티소개')}>파티소개</button>
        <button onClick={() => setTab('프로그램 정보')}>프로그램 정보</button>
      </div>
      {tab === '파티소개' ? <MemberList partyNumber={partyData.party_id} userId={userId} isMember={isMember} /> : <></>}
      {tab === '프로그램 정보' ? (
        <DetailInfo
          videoNumber={partyData.video_id}
          videoType={partyData.media_type}
          videoPlatform={partyData.video_platform}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default PartyBottom;
