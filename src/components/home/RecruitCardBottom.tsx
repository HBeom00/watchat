'use client';
import { partyInfo } from '@/types/partyInfo';
import { useMemberCount } from '@/reactQuery/useQuery/home/useMemberCount';
import { useOwnerInfo } from '@/reactQuery/useQuery/home/useOwnerInfo';
import { cutPartyName } from '@/utils/cutNameAndPartyName';
import { getViewStatus } from '@/utils/viewStatus';
import Image from 'next/image';
import React from 'react';

const RecruitCardBottom = ({ data }: { data: partyInfo }) => {
  const { data: memberCount, isLoading: isCountLoading } = useMemberCount(data.party_id);
  const cutPartyNameValue = cutPartyName(data.video_name);

  const { data: ownerInfo, isLoading } = useOwnerInfo(data);
  if (isLoading || isCountLoading) <div>Loading...</div>;
  return (
    <div className="flex flex-col items-center gap-1 self-stretch">
      <div className="flex flex-row items-start gap-1 self-stretch">
        <p className="max-w-[123px] text-Grey-600 label-l text-overflow-hidden"></p>
        <p className="text-Grey-600 label-l">
          {cutPartyNameValue}
          {data.season_number ? ' 시즌' + data.season_number : null}
          {data.episode_number ? ' ' + data.episode_number + '화' : null}
        </p>
      </div>
      <p className="text-static-black body-l-bold text-overflow-hidden self-stretch group-hover:text-primary-400 transition duration-300">
        {data.party_name}
      </p>
      <div className="flex flex-row items-end gap-1 self-stretch">
        {ownerInfo ? (
          <div className="flex flex-row max-w-[74px] items-center gap-[6px]">
            <Image
              src={ownerInfo.profile_image}
              width={16}
              height={16}
              style={{
                objectFit: 'cover',
                width: '16px',
                height: '16px',
                borderRadius: '50%'
              }}
              alt={`${ownerInfo.nickname}의 프로필`}
            />
            <p className="text-Grey-900 label-m text-overflow-hidden">{ownerInfo.nickname}</p>
          </div>
        ) : (
          <></>
        )}
        <p className="text-Grey-300 body-xs">|</p>
        <div className="flex flex-row text-Grey-900 label-m">
          <p className="text-primary-400">{memberCount ? memberCount : 0}</p>
          <p>명 {getViewStatus(data) === '시청중' ? '시청중' : '참여'}</p>
          <p className="mobile:hidden">{`❨${memberCount ? memberCount : 0}/${data.limited_member})명`}</p>
        </div>
      </div>
    </div>
  );
};

export default RecruitCardBottom;
