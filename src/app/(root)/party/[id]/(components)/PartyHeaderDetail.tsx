'use client';

import HeaderButtons from './HeaderButtons';

import Image from 'next/image';

import { useOwnerInfo } from '@/reactQuery/useQuery/home/useOwnerInfo';
import { useMemberCount } from '@/reactQuery/useQuery/home/useMemberCount';

import type { partyInfo } from '@/types/partyInfo';

const PartyHeaderDetail = ({ partyData, end }: { partyData: partyInfo; end: boolean }) => {
  const { data: memberCount, isLoading: isMemberCounting } = useMemberCount(partyData.party_id);
  const { data: ownerInfo, isLoading } = useOwnerInfo(partyData);

  if (isLoading || isMemberCounting) {
    return (
      <div>
        <div className="label-l-bold">Loading...</div>
        <div></div>
      </div>
    );
  }

  return (
    <>
      {/* 중간 */}
      <div className="flex flex-row gap-1 items-center">
        <p className="label-l-bold">주최자</p>
        {ownerInfo ? (
          <div className="flex flex-row gap-1">
            <Image
              className="rounded-full"
              src={ownerInfo.profile_image}
              width={16}
              height={16}
              alt={`${ownerInfo.nickname} 님의 프로필 사진`}
              style={{
                objectFit: 'cover',
                width: '16px',
                height: '16px',
                borderRadius: '50%'
              }}
            />
            <p className="label-l">{ownerInfo.nickname}</p>
          </div>
        ) : (
          <></>
        )}
        <p className="body-xs"> | </p>
        <p className="label-l-bold">참여자</p>
        <p className="label-l">{memberCount || 0}명</p>
        <p className="label-l">참여 예정 {`(${memberCount || 0}/${partyData.limited_member})명`}</p>
      </div>
      {/* 하단 */}
      <HeaderButtons end={end} partyData={partyData} />
    </>
  );
};

export default PartyHeaderDetail;
