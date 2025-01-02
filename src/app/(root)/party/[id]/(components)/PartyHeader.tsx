import Image from 'next/image';
import { partyInfo } from '@/types/partyInfo';
import { startTimeString } from '@/utils/startTimeString';
import PartyHeaderDetail from './PartyHeaderDetail';

const PartyHeader = ({ partyData, end }: { partyData: partyInfo; end: boolean }) => {
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
        <PartyHeaderDetail partyData={partyData} end={end} />
      </div>
    </div>
  );
};

export default PartyHeader;
