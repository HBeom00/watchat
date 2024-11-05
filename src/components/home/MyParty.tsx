'use client';

import { useQuery } from '@tanstack/react-query';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { partyInfo } from '@/types/partyInfo';
import { useSearchStore } from '@/providers/searchStoreProvider';

const MyParty = () => {
  const searchText = useSearchStore((state) => state.searchText);
  const { data: userId, isLoading: userLoading } = useQuery({
    queryKey: ['loginUser'],
    queryFn: () => getLoginUserIdOnClient()
  });

  const { data, isLoading } = useQuery({
    queryKey: ['myParty', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      const myParty: PostgrestSingleResponse<{ party_id: string }[]> = await browserClient
        .from('team_user_profile')
        .select('party_id')
        .eq('user_id', userId);
      if (myParty.data && myParty.data.length > 0) {
        const myPartyPromises = myParty.data.map(async (idData) => {
          const partyInfoResponse: PostgrestSingleResponse<partyInfo[]> = await browserClient
            .from('party_info')
            .select('*')
            .eq('party_id', idData.party_id);
          if (partyInfoResponse.data) {
            return partyInfoResponse.data[0];
          }
        });
        const result = await Promise.all(myPartyPromises);
        return result?.filter((n) => {
          if (n) {
            return getViewStatus(n) !== '시청완료';
          }
        });
      }
    }
  });
  if (isLoading || userLoading) <div>Loading...</div>;
  return (
    <>
      {searchText === '' && userId ? (
        <div className="flex flex-col gap-[18px] pt-8 pb-[18px] border-solid border-Grey-100 border-b-[1px]">
          <p>MY 파티</p>
          {data && data.length > 0 ? (
            <div className="grid grid-cols-5 gap-x-5 gap-y-8 text-Grey-900">
              {data
                .filter((n) => !(n?.situation === '종료'))
                .map((party) => {
                  if (party) {
                    return (
                      <RecruitCard
                        key={party.party_id}
                        data={party}
                        end={party.situation === '종료' || getViewStatus(party) === '시청완료'}
                      />
                    );
                  }
                })}
            </div>
          ) : (
            <p>참가한 파티가 없습니다</p>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default MyParty;
