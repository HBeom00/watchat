import { partyInfo, platform } from '@/types/partyInfo';
import { startTimeString } from '@/utils/startTimeString';
import { getViewStatus } from '@/utils/viewStatus';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import PlatformImageCard from '../styleComponents/PlatformImage';
import WatchingLabel from '../styleComponents/WatchingLabel';
import RecruitCardBottom from './RecruitCardBottom';

const RecruitCard = ({ data, end }: { data: partyInfo; end: boolean }) => {
  const platformArr: platform[] = JSON.parse(data.video_platform);
  const platform = platformArr.length !== 1 || platformArr[0].logoUrl === '알수없음' ? null : platformArr[0];

  return (
    <Link
      href={`/party/${data.party_id}`}
      className="relative flex flex-col w-[196px] items-start pb-3 gap-2 flex-shrink-0 group"
    >
      <div className="relative flex w-[196px] h-[280px] py-5 items-start gap-8 self-stretch rounded-sm overflow-hidden">
        <WatchingLabel partyData={data} />
        {platform ? <PlatformImageCard platform={platform} /> : <></>}
        {data.privacy_setting === '비공개' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 ">
            <Image src="/lock.svg" alt="비공개" width={20} height={27} />
          </div>
        )}
        <Image
          className={
            end
              ? 'rounded-sm brightness-50  group-hover:scale-105 transition duration-300'
              : 'rounded-sm  group-hover:scale-105 transition duration-300'
          }
          src={data.video_image}
          alt={data.video_name}
          style={{ objectFit: 'cover' }}
          sizes="196px"
          fill
        />
        {end || getViewStatus(data) === '시청중' ? (
          <></>
        ) : (
          <div className="card-down">
            <p className="label-l text-static-white">{startTimeString(data.start_date_time)}</p>
          </div>
        )}
      </div>
      <RecruitCardBottom data={data} />
    </Link>
  );
};

export default RecruitCard;
