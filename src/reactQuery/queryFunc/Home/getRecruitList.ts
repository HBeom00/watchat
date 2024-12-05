import { partyAndOwner, partyAndProfiles } from '@/types/partyInfo';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from '../../../utils/supabase/client';
import { endDataNumber, nowTime, platformConversion, startDataNumber } from '@/utils/mainPageData/pageFilter';

//모집필터
//페이지네이션
//정렬
// 플랫폼
const getRecruitList = async (partySituation: string | null, pageNumber: number, order: string, filter: string) => {
  const response = (
    partySituation === 'recruiting'
      ? await browserClient
          .from('party_info')
          .select('*, team_user_profile!inner(*)')
          .range(startDataNumber(pageNumber), endDataNumber(pageNumber))
          .order(order, { ascending: false })
          .gte('start_date_time', nowTime()) // 현재시간보다 이후에 시작하는  아직 모집중인 데이터
          .eq('situation', '모집중') // 모집 마감이 아닌 경우
          .textSearch('video_platform', platformConversion(filter))
      : partySituation === 'current'
      ? await browserClient
          .from('party_info')
          .select('*, team_user_profile!inner(*)')
          .range(startDataNumber(pageNumber), endDataNumber(pageNumber))
          .order(order, { ascending: false })
          .lte('start_date_time', nowTime()) // 시작 시간이 지났고
          .gte('end_time', nowTime()) // 시청 종료 시간이 지나지 않은 경우
          .textSearch('video_platform', platformConversion(filter))
      : await browserClient
          .from('party_info')
          .select('*, team_user_profile!inner(*)')
          .range(startDataNumber(pageNumber), endDataNumber(pageNumber))
          .order(order, { ascending: false })
          .gte('end_time', nowTime()) // 종료 시간이 지나지 않은 경우만
          .textSearch('video_platform', platformConversion(filter))
  ) as PostgrestSingleResponse<partyAndProfiles[]>;

  // const test = (await browserClient
  //   .from('party_info')
  //   .select('*, team_user_profile!inner(*)')
  //   .range(startDataNumber(pageNumber), endDataNumber(pageNumber))
  //   .order(order, { ascending: false })
  //   .gte('end_time', nowTime()) // 종료 시간이 지나지 않은 경우만
  //   .textSearch('video_platform', platformConversion(filter))) as PostgrestSingleResponse<partyAndProfiles[]>;
  // const result: partyAndOwner[] | undefined = test.data?.map((n) => {
  //   const profileFilter = n.team_user_profile.filter((i) => {
  //     return i.user_id === n.owner_id;
  //   });
  //   return { ...n, owner_info: profileFilter[0] };
  // });
  // console.log(result);

  const result: partyAndOwner[] | undefined = response.data?.map((n) => {
    const profileFilter = n.team_user_profile.filter((i) => {
      return i.user_id === n.owner_id;
    });
    return { ...n, owner_info: profileFilter[0] };
  });

  if (result && result.length > 0) {
    return result;
  }

  return [];
};

export default getRecruitList;
