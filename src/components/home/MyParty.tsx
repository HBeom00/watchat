'use client';

import { useQuery } from '@tanstack/react-query';
import RecruitCard from './RecruitCard';
import { getViewStatus } from '@/utils/viewStatus';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { partyAndOwner, partyAndProfiles } from '@/types/partyInfo';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/app/loading';
// import { useEffect } from 'react';
import { nowTime } from '@/utils/mainPageData/pageFilter';

const MyParty = () => {
  const params = useSearchParams();
  const filter = params.get('watch');
  const searchText = params.get('search');

  const { data: userId, isLoading: userLoading } = useQuery({
    queryKey: ['loginUser'],
    queryFn: () => getLoginUserIdOnClient()
  });

  // useEffect(() => {
  //   const getTest = async () => {
  //     const test = (await browserClient
  //       .from('team_user_profile')
  //       .select('party_info!inner(*,team_user_profile!inner(*))')
  //       .eq('user_id', userId)
  //       .gte('party_info.end_time', nowTime())) as PostgrestSingleResponse<
  //       {
  //         party_info: partyAndProfiles;
  //       }[]
  //     >;
  //     const result: partyAndOwner[] | undefined = test.data?.map((n) => {
  //       const profileFilter = n.party_info.team_user_profile.filter((i) => {
  //         return i.user_id === n.party_info.owner_id;
  //       });
  //       return { ...n.party_info, owner_info: profileFilter[0] };
  //     });
  //     console.log('테스트', result);
  //   };
  //   if (userId) {
  //     getTest();
  //   }
  // }, [userId]);

  const { data, isLoading } = useQuery({
    queryKey: ['myParty', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      // const myParty: PostgrestSingleResponse<{ party_id: string }[]> = await browserClient
      //   .from('team_user_profile')
      //   .select('party_id')
      //   .eq('user_id', userId);
      // if (myParty.data && myParty.data.length > 0) {
      //   const myPartyPromises = myParty.data.map(async (idData) => {
      //     const partyInfoResponse: PostgrestSingleResponse<partyInfo[]> = await browserClient
      //       .from('party_info')
      //       .select('*')
      //       .eq('party_id', idData.party_id);
      //     if (partyInfoResponse.data) {
      //       return partyInfoResponse.data[0];
      //     }
      //   });
      //   const result = await Promise.all(myPartyPromises);
      //   return result?.filter((n) => {
      //     if (n) {
      //       return getViewStatus(n) !== '시청완료';
      //     }
      //   });
      // }

      // const test = (await browserClient
      //   .from('team_user_profile')
      //   .select('party_info!inner(*)')
      //   .eq('user_id', userId)
      //   .gte('party_info.end_time', nowTime())) as PostgrestSingleResponse<
      //   {
      //     party_info: partyInfo;
      //   }[]
      // >;

      const response = (await browserClient
        .from('team_user_profile')
        .select('party_info!inner(*,team_user_profile!inner(*))')
        .eq('user_id', userId)
        .gte('party_info.end_time', nowTime())) as PostgrestSingleResponse<
        {
          party_info: partyAndProfiles;
        }[]
      >;
      const result: partyAndOwner[] | undefined = response.data?.map((n) => {
        const profileFilter = n.party_info.team_user_profile.filter((i) => {
          return i.user_id === n.party_info.owner_id;
        });
        return { ...n.party_info, owner_info: profileFilter[0] };
      });

      if (result && result.length > 0) {
        return result;
      }

      return [];
    }
  });
  if (isLoading || userLoading) <Loading />;
  return (
    <>
      {(filter === '' || filter === null) && (searchText === '' || searchText === null) && userId ? (
        <div className="flex flex-col pt-4 pb-8 border-solid border-Grey-100 border-b-[1px]">
          <p className="py-4 text-Grey-900 title-m">MY 파티</p>
          {data && data.length > 0 ? (
            <div
              className={`grid grid-cols-5 gap-x-[20px] gap-y-[32px] text-Grey-900
            mobile:grid-cols-2 mobile:gap-x-[16px]`}
            >
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
