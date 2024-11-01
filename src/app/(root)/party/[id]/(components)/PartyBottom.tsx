'use client';

import { useState } from 'react';
import DetailInfo from './DetailInfo';
import MemberList from './MemberList';
import { isMemberExist } from '@/utils/memberCheck';
import { useQuery } from '@tanstack/react-query';
import { partyInfo } from '@/types/partyInfo';

const PartyBottom = ({
  partyData,
  userId,
  end,
  partyOwner
}: {
  partyData: partyInfo;
  userId: string | null;
  end: boolean;
  partyOwner: string;
}) => {
  const [tab, setTab] = useState<string>('파티 정보');

  //로그인한 사용자가 해당 파티에 가입했을 때
  const { data: isMember, isLoading } = useQuery({
    queryKey: ['isMember', partyData.party_id, userId],
    queryFn: async () => await isMemberExist(partyData.party_id, userId)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-10 w-full justify-center items-center bg-slate-400">
      <div className="flex flex-row gap-10">
        <button onClick={() => setTab('파티 정보')}>파티 정보</button>
        <button onClick={() => setTab('프로그램 정보')}>프로그램 정보</button>
      </div>
      {tab === '파티 정보' ? (
        <MemberList partyData={partyData} userId={userId} isMember={isMember} end={end} partyOwner={partyOwner} />
      ) : (
        <></>
      )}
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
