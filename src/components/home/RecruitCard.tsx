import { partyInfo, platform } from '@/types/partyInfo';
import { member } from '@/utils/memberCheck';
import browserClient from '@/utils/supabase/client';
import { getViewStatus } from '@/utils/viewStatus';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const RecruitCard = ({ data, end }: { data: partyInfo; end: boolean }) => {
  const blurred = end ? 'p-10 bg-gray-200 brightness-50' : 'p-10 bg-gray-200';
  const platformArr: platform[] = JSON.parse(data.video_platform);
  const platform = platformArr.length !== 1 || platformArr[0].logoUrl === '알수없음' ? null : platformArr[0];

  const { data: memberCount, isLoading: isCountLoading } = useQuery({
    queryKey: ['memberCount', data.party_id],
    queryFn: async () => {
      const response: PostgrestSingleResponse<{ profile_id: string }[]> = await browserClient
        .from('team_user_profile')
        .select('profile_id')
        .eq('party_id', data.party_id);
      if (response.data) {
        return response.data.length;
      }
      return 0;
    }
  });

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

  return (
    <Link href={`/party/${data.party_id}`} className={blurred}>
      <p>{getViewStatus(data) === '모집중' ? data.situation : getViewStatus(data)}</p>
      <div className="flex flex-row gap-5">
        <p>{data.watch_date}</p>
        <p>{data.start_time.split('.')[0]}</p>
      </div>
      <p>{data.video_name}</p>
      <p>{data.party_name}</p>
      {ownerInfo ? (
        <div className="flex flex-row">
          <p>{ownerInfo[0].nickname}</p>
          <Image src={ownerInfo[0].profile_image} width={50} height={50} alt={ownerInfo[0].nickname} />
        </div>
      ) : (
        <></>
      )}

      <p>{`${memberCount ? memberCount : 0}/${data.limited_member}`}</p>
      {platform ? <Image src={platform.logoUrl} width={50} height={50} alt={platform.name} /> : <></>}
    </Link>
  );
};

export default RecruitCard;
