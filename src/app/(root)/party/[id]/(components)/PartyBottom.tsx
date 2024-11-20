'use client';

import { useState } from 'react';
import DetailInfo from './DetailInfo';
import MemberList from './MemberList';
import { useQuery } from '@tanstack/react-query';
import { partyInfo } from '@/types/partyInfo';
import { getLoginUserIdOnClient } from '@/utils/supabase/client';

const PartyBottom = ({ partyData, end, partyOwner }: { partyData: partyInfo; end: boolean; partyOwner: string }) => {
  const [tab, setTab] = useState<string>('파티 정보');
  const { data: userId, isLoading: userLoading } = useQuery({
    queryKey: ['loginUser'],
    queryFn: () => getLoginUserIdOnClient()
  });

  if (userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex flex-col w-full items-start mt-[8px] gap-[32px] mb-[64px]
     mobile:px-[20px]`}
    >
      <div className="flex flex-row w-full border-solid border-Grey-100 border-b-[1px] text-Grey-400 body-m-bold">
        <button
          className={tab === '파티 정보' ? 'selectPartyInfo' : 'notSelectPartyInfo'}
          onClick={() => setTab('파티 정보')}
        >
          파티 정보
        </button>
        <button
          className={tab === '프로그램 정보' ? 'selectPartyInfo' : 'notSelectPartyInfo'}
          onClick={() => setTab('프로그램 정보')}
        >
          프로그램 정보
        </button>
      </div>
      {tab === '파티 정보' ? (
        <MemberList partyData={partyData} userId={userId} end={end} partyOwner={partyOwner} />
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
