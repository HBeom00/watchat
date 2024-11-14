import RecruitCardBottom from '@/components/home/RecruitCardBottom';
import { partyInfo } from '@/types/partyInfo';
import Image from 'next/image';

const WarmingPartyInfo = async ({ partyData }: { partyData: partyInfo | null }) => {
  return (
    <div className="flex p-[16px] items-center gap-[16px] self-stretch bg-Grey-50 rounded-[4px]">
      {partyData ? (
        <>
          <Image
            src={partyData?.video_image}
            width={70}
            height={100}
            className="w-[70px] h-[100px] rounded-[4px]"
            alt={partyData?.video_name}
          />
          <div className="flex justify-center items-center">
            <RecruitCardBottom data={partyData} />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WarmingPartyInfo;
