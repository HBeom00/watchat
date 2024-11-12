import { createClient, getLoginUserIdOnServer } from '@/utils/supabase/server';
import WarmingMemberList from '../(components)/WarmingMemberList';
import WarmingPartyInfo from '../(components)/WarmingPartyInfo';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

import type { member } from '@/types/partyMember';

const page = async ({ params }: { params: { id: string } }) => {
  const client = createClient();
  const userId = await getLoginUserIdOnServer();
  const response: PostgrestSingleResponse<member[]> = await client
    .from('team_user_profile')
    .select('*')
    .eq('party_id', params.id);
  const memberData = response.data && response.data.filter((n) => n.user_id !== userId);
  return (
    <div className="flex flex-col w-[340px] mx-auto justify-center items-center mt-[70px]">
      <div className="flex flex-col items-start gap-[16px] self-stretch">
        <div className="flex flex-col mx-auto gap-[4px] text-center">
          <p className="text-Grey-900 title-m">후기 작성하기</p>
          <p className="text-Grey-600 label-l">함께 시청한 멤버의 후기를 남겨보세요.</p>
        </div>
        <WarmingPartyInfo party_id={params.id} />
      </div>
      {memberData && memberData.length > 0 && userId ? (
        <WarmingMemberList partyId={params.id} userId={userId} memberData={memberData} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default page;
