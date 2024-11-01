'use client';

import { useQuery } from '@tanstack/react-query';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';
import browserClient from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { partyInfo } from '@/types/partyInfo';
import { useSearchStore } from '@/providers/searchStoreProvider';

const MyParty = ({ userId }: { userId: string }) => {
  const searchText = useSearchStore((state) => state.searchText);

  const { data, isLoading } = useQuery({
    queryKey: ['myParty', userId],
    queryFn: async () => {
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
  if (isLoading) <div>Loading...</div>;
  return (
    <>
      {searchText === '' ? (
        <div>
          <p>MY 파티</p>
          <div className="flex flex-row gap-10 p-10">
            {data
              ?.filter((n) => !(n?.situation === '종료'))
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
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default MyParty;
