import { createClient, getLoginUserIdOnServer } from '@/utils/supabase/server';
import WarmingMemberList from '../(components)/WarmingMemberList';
import WarmingPartyInfo from '../(components)/WarmingPartyInfo';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

import type { member } from '@/types/partyMember';
import { partyInfo } from '@/types/partyInfo';

const page = async ({ params }: { params: { id: string } }) => {
  const client = createClient();

  const userId = await getLoginUserIdOnServer();

  const partyDataResponse: PostgrestSingleResponse<partyInfo> = await client
    .from('party_info')
    .select('*')
    .eq('party_id', params.id)
    .single();
  const partyData = partyDataResponse.data;

  const memberDataResponse: PostgrestSingleResponse<member[]> = await client
    .from('team_user_profile')
    .select('*')
    .eq('party_id', params.id);
  const myProfile = memberDataResponse.data && memberDataResponse.data.filter((n) => n.user_id === userId);
  const memberDataArr = memberDataResponse.data && memberDataResponse.data.filter((n) => n.user_id !== userId);
  const memberData = memberDataArr
    ?.filter((n) => n.user_id === partyData?.owner_id)
    .concat(memberDataArr?.filter((n) => n.user_id !== partyData?.owner_id));
  return (
    <div
      className={`flex flex-col w-[340px] gap-[16px] mx-auto justify-center items-center mt-[70px] mb-[142px]
      mobile:w-[375px] mobile:px-[20px] mobile:mt-0
    `}
    >
      <div className="flex flex-col items-start gap-[16px] self-stretch">
        <div className="flex flex-col mx-auto gap-[4px] text-center">
          <p className="text-Grey-900 title-m mobile:mt-[8px] mobile:text-[16px] mobile:not-italic mobile:font-[600]">
            후기 작성하기
          </p>
          <p
            className={`text-Grey-600 label-l
              mobile:hidden
            `}
          >
            함께 시청한 멤버의 후기를 남겨보세요.
          </p>
        </div>
        <WarmingPartyInfo partyData={partyData} />
      </div>
      {memberData && memberData.length > 0 && userId ? (
        <WarmingMemberList
          partyId={params.id}
          userId={userId}
          memberData={memberData}
          ownerId={partyData?.owner_id}
          isComplete={myProfile === null || myProfile.length === 0 || (myProfile && myProfile[0].warming_end)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default page;
