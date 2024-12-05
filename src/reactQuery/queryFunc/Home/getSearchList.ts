import { partyAndOwner, partyAndProfiles } from '@/types/partyInfo';
import { endDataNumber, nowTime, platformConversion, startDataNumber } from '@/utils/mainPageData/pageFilter';
import browserClient from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

//검색필터
//모집필터
//페이지네이션 start end
// 플랫폼
// 시청중 nowTime()
const getSearchList = async (
  wordConversion: string,
  partySituation: string | null,
  pageNumber: number,
  order: string,
  filter: string
) => {
  const response = (
    partySituation === 'recruiting'
      ? await browserClient
          .from('party_info')
          .select('*, team_user_profile!inner(*)')
          .range(startDataNumber(pageNumber), endDataNumber(pageNumber))
          .order(order, { ascending: false })
          .gte('start_date_time', nowTime())
          .eq('situation', '모집중')
          .textSearch('video_platform', platformConversion(filter))
          .ilike('video_name', wordConversion) // 검색어
      : partySituation === 'current'
      ? await browserClient
          .from('party_info')
          .select('*, team_user_profile!inner(*)')
          .range(startDataNumber(pageNumber), endDataNumber(pageNumber))
          .order(order, { ascending: false })
          .lte('start_date_time', nowTime())
          .gte('end_time', nowTime())
          .textSearch('video_platform', platformConversion(filter))
          .ilike('video_name', wordConversion) // 검색어
      : await browserClient
          .from('party_info')
          .select('*, team_user_profile!inner(*)')
          .range(startDataNumber(pageNumber), endDataNumber(pageNumber))
          .order(order, { ascending: false })
          .textSearch('video_platform', platformConversion(filter))
          .ilike('video_name', wordConversion)
  ) as PostgrestSingleResponse<partyAndProfiles[]>; // 검색어

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

export default getSearchList;
