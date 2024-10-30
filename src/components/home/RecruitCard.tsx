import { nowWatchingDate } from '@/app/(root)/party/[id]/dateChecker';
import { partyInfo, platform } from '@/types/partyInfo';
import browserClient from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const RecruitCard = ({ data, end }: { data: partyInfo; end: boolean }) => {
  const blurred = end ? 'p-10 bg-gray-200 brightness-50' : 'p-10 bg-gray-200';
  const platformArr: platform[] = JSON.parse(data.video_platform);
  const platform = platformArr.length !== 1 || platformArr[0].logoUrl === '알수없음' ? null : platformArr[0];

  const { data: memberCount, isLoading } = useQuery({
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
  if (isLoading) <div>Loading...</div>;

  console.log(nowWatchingDate(data.watch_date, data.start_time, data.duration_time));
  return (
    <Link href={`/party/${data.party_id}`} className={blurred}>
      <p>{}</p>
      <p>{data.party_name}</p>
      <p>{data.video_name}</p>
      <p>{data.situation}</p>
      <p>{data.watch_date}</p>
      <p>{data.start_time.split('.')[0]}</p>
      <p>{`${memberCount ? memberCount : 0}/${data.limited_member}`}</p>
      {platform ? <Image src={platform.logoUrl} width={50} height={50} alt={platform.name} /> : <></>}
    </Link>
  );
};

export default RecruitCard;
