import { partyInfo } from '@/types/partyInfo';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from './supabase/client';

//검색필터
//모집필터
//페이지네이션 start end
// 플랫폼
// 시청중 now
const getRecruitList = async (
  wordConversion: string,
  partySituation: string | null,
  start: number,
  end: number,
  order: string,
  bull: string,
  now: string
) => {
  const response: PostgrestSingleResponse<partyInfo[]> =
    // 검색을 안하는 경우
    wordConversion === '+'
      ? partySituation === 'recruiting'
        ? await browserClient
            .from('party_info')
            .select('*')
            .range(start, end)
            .order(order, { ascending: false })
            .gte('start_date_time', now) // 현재시간보다 이후에 시작하는  아직 모집중인 데이터
            .eq('situation', '모집중') // 모집 마감이 아닌 경우
            .textSearch('video_platform', bull)
        : partySituation === 'current'
        ? await browserClient
            .from('party_info')
            .select('*')
            .range(start, end)
            .order(order, { ascending: false })
            .lte('start_date_time', now) // 시작 시간이 지났고
            .gte('end_time', now) // 시청 종료 시간이 지나지 않은 경우
            .textSearch('video_platform', bull)
        : await browserClient
            .from('party_info')
            .select('*')
            .range(start, end)
            .order(order, { ascending: false })
            .gte('end_time', now) // 종료 시간이 지나지 않은 경우만
            .textSearch('video_platform', bull)
      : //검색을 하는 경우
      partySituation === 'recruiting'
      ? await browserClient
          .from('party_info')
          .select('*')
          .range(start, end)
          .order(order, { ascending: false })
          .gte('start_date_time', now)
          .eq('situation', '모집중')
          .textSearch('video_platform', bull)
          .textSearch('video_name', wordConversion) // 검색어
      : partySituation === 'current'
      ? await browserClient
          .from('party_info')
          .select('*')
          .range(start, end)
          .order(order, { ascending: false })
          .lte('start_date_time', now)
          .gte('end_time', now)
          .textSearch('video_platform', bull)
          .textSearch('video_name', wordConversion) // 검색어
      : await browserClient
          .from('party_info')
          .select('*')
          .range(start, end)
          .order(order, { ascending: false })
          .gte('end_time', now) // 종료 시간이 지나지 않은 경우만
          .textSearch('video_platform', bull)
          .textSearch('video_name', wordConversion); // 검색어

  if (response.error) {
    return [];
  }

  return response.data;
};

export default getRecruitList;
