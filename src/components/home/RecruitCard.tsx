import { watchStatus } from '@/customCSS/platform';
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

  // const blurred = end ? 'bg-gray-200 brightness-50' : 'bg-gray-200';
  return (
    <Link
      href={`/party/${data.party_id}`}
      className="relative flex flex-col w-[196px] items-start pb-3 gap-2 flex-shrink-0"
    >
      <div className="relative flex w-[196px] h-[280px] py-5 items-start gap-8 self-stretch">
        <p className={watchStatus}>{getViewStatus(data) === '모집중' ? data.situation : getViewStatus(data)}</p>
        {platform ? <Image src={platform.logoUrl} width={50} height={50} alt={platform.name} /> : <></>}
        <Image className="rounded-sm" src={data.video_image} layout="fill" objectFit="cover" alt={data.video_name} />
        <div className="flex w-full h-7 py-1 px-3 gap-1 items-center absolute bottom-0 z-10 bg-black opacity-50">
          <p className="text-static-white">{startTimeString(data.start_date_time)}</p>
        </div>
      </div>
      <p>{data.video_name}</p>
      {data.episode_number ? <p>{data.episode_number}화</p> : <></>}
      <p>{data.party_name}</p>
      {ownerInfo ? (
        <div className="flex flex-row">
          <p>{ownerInfo[0].nickname}</p>
          <Image src={ownerInfo[0].profile_image} width={50} height={50} alt={ownerInfo[0].nickname} />
        </div>
      ) : (
        <></>
      )}
      <p>{memberCount ? memberCount : 0}명 참여</p>
      <p>{`${memberCount ? memberCount : 0}/${data.limited_member}명`}</p>
    </Link>
  );
};

export default RecruitCard;
