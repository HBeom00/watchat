'use client';
import Image from 'next/image';
import { partyInfo } from '@/types/partyInfo';
import { useMemberCount } from '@/reactQuery/useQuery/home/useMemberCount';
import { startTimeString } from '@/utils/startTimeString';
import HeaderButtons from './HeaderButtons';
import { useOwnerInfo } from '@/reactQuery/useQuery/home/useOwnerInfo';

const PartyHeader = ({ partyData, end }: { partyData: partyInfo; end: boolean }) => {
  const { data: memberCount, isLoading: isMemberCounting } = useMemberCount(partyData.party_id);
  const { data: ownerInfo, isLoading } = useOwnerInfo(partyData);

  if (isLoading || isMemberCounting) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`inline-flex w-full items-center pt-8 pl-8 pb-10 relative text-static-white ${
        partyData.backdrop_image === null && 'bg-Grey-500'
      }`}
    >
      {partyData.backdrop_image !== null ? (
        <Image
          src={`https://image.tmdb.org/t/p/original${partyData.backdrop_image}`}
          className="relative brightness-50 -z-10"
          fill
          style={{ objectFit: 'cover' }}
          alt={partyData.video_name}
        />
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-4 items-start">
        {/* 상단 */}
        <div className="flex flex-col items-start gap-2 self-stretch">
          <p className="self-stretch body-l-bold">{end ? '시청 종료' : startTimeString(partyData.start_date_time)}</p>
          <p className="self-stretch heading-l">{partyData.party_name}</p>
        </div>
        <div className="flex flex-row gap-1 self-stretch body-s">
          <p>{partyData.video_name}</p>
          {partyData.episode_number ? <p>{partyData.episode_number}화</p> : <></>}
        </div>
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
      </div>
    </div>
  );
};

export default PartyHeader;
