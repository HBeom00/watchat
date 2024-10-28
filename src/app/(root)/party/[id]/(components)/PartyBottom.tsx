'use client';

import { useState } from 'react';
import { partyInfo } from '../page';
import DetailInfo from './DetailInfo';
import MemberList from './MemberList';
import Owner from './Owner';
import InvitedButton from './InvitedButton';

const PartyBottom = ({
  partyData,
  isOwner,
  userId
}: {
  partyData: partyInfo;
  isOwner: boolean;
  userId: string | null;
}) => {
  const [tab, setTab] = useState<string>('영상정보');

  return (
    <div className="flex flex-col gap-10 w-full h-96 justify-center items-center bg-slate-400">
      {/* 누르면 내가 팔로우한 유저들이 표시되고 그 중에서 초대할 수 있음 */}
      {userId ? <InvitedButton partyNumber={partyData.party_id} userId={userId} /> : <></>}

      <div className="flex flex-row gap-10">
        <button onClick={() => setTab('영상정보')}>영상정보</button>
        <button onClick={() => setTab('팀원정보')}>팀원정보</button>
        {isOwner ? <button onClick={() => setTab('오너구역')}>오너구역</button> : <></>}
      </div>
      {tab === '영상정보' ? <DetailInfo videoNumber={partyData.video_id} videoType={partyData.media_type} /> : <></>}
      {tab === '팀원정보' ? <MemberList partyNumber={partyData.party_id} userId={userId} isOwner={false} /> : <></>}
      {tab === '오너구역' ? <Owner partyNumber={partyData.party_id} userId={userId} isOwner={isOwner} /> : <></>}
    </div>
  );
};

export default PartyBottom;
