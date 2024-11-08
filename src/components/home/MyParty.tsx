'use client';

import { useQuery } from '@tanstack/react-query';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { partyInfo } from '@/types/partyInfo';
import { useSearchParams } from 'next/navigation';

const MyParty = () => {
  const params = useSearchParams();
  const filter = params.get('watch');
  const searchText = params.get('search');

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
      return [];
    }
  });
  if (isLoading || userLoading) <div>Loading...</div>;
  return (
    <>
      {(filter === '' || filter === null) && (searchText === '' || searchText === null) && userId ? (
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
            <div className="w-full flex flex-col justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="74" height="64" viewBox="0 0 74 64" fill="none">
                <path
                  d="M65.1058 17.0681C63.6538 14.6175 62.3349 11.7615 61.2096 8.91153C59.7515 5.35362 57.2226 -1.38704 51.9348 0.25274C46.4777 1.88042 42.2366 16.2694 36.126 16.2573C30.7475 16.227 25.2783 1.43266 20.529 0.270893C13.4202 -1.55042 11.3147 11.5134 8.89471 15.6401C6.40208 21.1887 3.2379 25.0492 1.67699 30.7188C-4.20367 52.7985 11.2845 63.9986 37.0335 63.9986C69.117 63.9986 78.4341 42.7722 71.0349 26.9734C69.4679 23.5002 67.0902 20.4747 65.1481 17.1468L65.0937 17.056L65.1058 17.0681Z"
                  fill="#DCDCDC"
                />
                <path
                  d="M36.9367 44.9505C38.0394 44.9505 38.9332 44.0565 38.9332 42.9537C38.9332 41.8509 38.0394 40.9569 36.9367 40.9569C35.8341 40.9569 34.9402 41.8509 34.9402 42.9537C34.9402 44.0565 35.8341 44.9505 36.9367 44.9505Z"
                  fill="white"
                />
                <path
                  d="M20.7105 38.0101C21.745 39.8799 23.7536 41.1142 25.8893 41.1929C28.025 41.2716 30.1728 40.0795 31.3223 38.2522C31.9454 37.2598 30.3724 36.3462 29.7553 37.3385C28.9264 38.6515 27.4139 39.4381 25.8893 39.3776C24.3647 39.3171 23.0095 38.4095 22.2774 37.0904C21.7087 36.0678 20.1418 36.9815 20.7105 38.0041V38.0101Z"
                  fill="white"
                />
                <path
                  d="M42.5572 38.0101C43.5918 39.8799 45.6004 41.1142 47.7361 41.1929C49.8717 41.2716 52.0195 40.0795 53.169 38.2522C53.7922 37.2598 52.2192 36.3462 51.6021 37.3385C50.7732 38.6515 49.2607 39.4381 47.7361 39.3776C46.2115 39.3171 44.8563 38.4095 44.1242 37.0904C43.5555 36.0678 41.9885 36.9815 42.5572 38.0041V38.0101Z"
                  fill="white"
                />
              </svg>
              <p>참여한 파티가 없습니다</p>
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default MyParty;
