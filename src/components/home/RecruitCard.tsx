import { partyInfo, platform } from '@/types/partyInfo';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const RecruitCard = ({ data, end }: { data: partyInfo; end: boolean }) => {
  const platform: platform = JSON.parse(data.video_platform).slice(0, 1)[0];
  const blurred = end ? 'p-10 bg-gray-200 brightness-50' : 'p-10 bg-gray-200';

  return (
    <Link href={`/party/${data.party_id}`} className={blurred}>
      <p>{data.party_name}</p>
      <p>{data.situation}</p>
      <p>{data.watch_date}</p>
      <p>{`0/${data.limited_member}`}</p>
      {platform ? <Image src={platform.logoUrl} width={50} height={50} alt={platform.name} /> : <></>}
    </Link>
  );
};

export default RecruitCard;
