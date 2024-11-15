'use client';

import { useQuery } from '@tanstack/react-query';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { partyInfo } from '@/types/partyInfo';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
        <div className="flex flex-col pt-4 pb-8 border-solid border-Grey-100 border-b-[1px]">
          <p className="py-4 text-Grey-900 title-m">MY 파티</p>
          {data && data.length > 0 ? (
            <div className="grid grid-cols-5 gap-x-5 gap-y-8 text-Grey-900">
              {data
                .filter((n) => n && getViewStatus(n) === '시청중')
                .concat(data.filter((n) => n && getViewStatus(n) !== '시청중'))
                .map((party) => {
                  if (party) {
                    return (
                      <Link key={party.party_id} href={`/party/${party.party_id}`}>
                        <RecruitCard data={party} end={getViewStatus(party) === '시청완료'} />
                      </Link>
                    );
                  }
                })}
            </div>
          ) : (
            <div className="w-full flex flex-col justify-center items-center py-16">
              <Image src={'/sleepingCat.svg'} width={73} height={64} className="p-2" alt="참여한 파티가 없습니다" />
              <p className="text-Grey-500 text-center self-stretch body-m">참여한 파티가 없습니다.</p>
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
