import { partyInfo, platform } from '@/types/partyInfo';
import { member } from '@/utils/memberCheck';
import { startTimeString } from '@/utils/startTimeString';
import browserClient from '@/utils/supabase/client';
import { useMemberCount } from '@/utils/useMemberCount';
import { getViewStatus } from '@/utils/viewStatus';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import PlatformImageCard from '../styleComponents/PlatformImage';

const RecruitCard = ({ data, end }: { data: partyInfo; end: boolean }) => {
  const platformArr: platform[] = JSON.parse(data.video_platform);
  const platform = platformArr.length !== 1 || platformArr[0].logoUrl === '알수없음' ? null : platformArr[0];

  const { data: memberCount, isLoading: isCountLoading } = useMemberCount(data.party_id);

  const { data: ownerInfo, isLoading } = useQuery({
    queryKey: ['partyOwnerInfo', data.party_id],
    queryFn: async () => {
      const response: PostgrestSingleResponse<member[]> = await browserClient
        .from('team_user_profile')
        .select('*')
        .eq('user_id', data.owner_id);
      return response.data;
    }
  });
  if (isLoading || isCountLoading) <div>Loading...</div>;
  console.log(getViewStatus(data), data.situation, data.video_name);

  return (
    <Link
      href={`/party/${data.party_id}`}
      className="relative flex flex-col w-[196px] items-start pb-3 gap-2 flex-shrink-0"
    >
      <div className="relative flex w-[196px] h-[280px] py-5 items-start gap-8 self-stretch rounded-sm">
        <div className="flex py-1 px-3 justify-center items-center gap-2 absolute left-3 top-3 z-10 rounded-lg bg-purple-50">
          <p className="">{getViewStatus(data) === '모집중' ? data.situation : getViewStatus(data)}</p>
        </div>
        {platform ? <PlatformImageCard platform={platform} /> : <></>}
        <Image
          className={end ? 'rounded-sm brightness-50' : 'rounded-sm'}
          src={data.video_image}
          layout="fill"
          objectFit="cover"
          alt={data.video_name}
        />
        {end ? (
          <></>
        ) : (
          <div className="card-down">
            <p className="label-l text-static-white">{startTimeString(data.start_date_time)}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 self-stretch">
        <div className="flex flex-col items-start gap-1 self-stretch">
          <div className="flex flex-row gap-1 text-Grey-600 label-l">
            <p>{data.video_name}</p>
            {data.episode_number ? <p>{data.episode_number}화</p> : <></>}
          </div>
          <p className="self-stretch text-static-black body-l-bold overflow-hidden text-ellipsis">{data.party_name}</p>
        </div>
        <div className="flex flex-row items-end gap-1 self-stretch">
          {ownerInfo ? (
            <div className="flex flex-row items-center gap-[6px]">
              <Image
                src={ownerInfo[0].profile_image}
                width={16}
                height={16}
                style={{
                  objectFit: 'cover',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%'
                }}
                alt={`${ownerInfo[0].nickname}의 프로필`}
              />
              <p className="text-Grey-900 label-m">{ownerInfo[0].nickname}</p>
            </div>
          ) : (
            <></>
          )}
          <p className="text-Grey-300 body-xs">|</p>
          <div className="flex flex-row text-Grey-900 label-m">
            <p className="text-primary-400">{memberCount ? memberCount : 0}</p>
            <p>명 {getViewStatus(data) === '시청중' ? '시청중' : '참여'}</p>
            <p>{`❨${memberCount ? memberCount : 0}/${data.limited_member})명`}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecruitCard;
