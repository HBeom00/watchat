import RecruitCardBottom from '@/components/home/RecruitCardBottom';
import { partyInfo } from '@/types/partyInfo';
import { createClient } from '@/utils/supabase/server';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import Image from 'next/image';

const WarmingPartyInfo = async ({ party_id }: { party_id: string }) => {
  const client = createClient();
  const response: PostgrestSingleResponse<partyInfo> = await client
    .from('party_info')
    .select('*')
    .eq('party_id', party_id)
    .single();
  const partyData = response.data;
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
