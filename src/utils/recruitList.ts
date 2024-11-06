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
      ? partySituation === '모집중'
        ? await browserClient
            .from('party_info')
            .select('*')
            .range(start, end)
            .order('start_date_time', { ascending: false })
            .order(order, { ascending: false })
            .gte('start_date_time', now)
            .eq('situation', '모집중')
            .textSearch('video_platform', bull)
        : partySituation === '시청중'
        ? await browserClient
            .from('party_info')
            .select('*')
            .range(start, end)
            .order('start_date_time', { ascending: false })
            .order(order, { ascending: false })
            .lte('start_date_time', now)
            .gte('end_time', now)
            .textSearch('video_platform', bull)
        : await browserClient
            .from('party_info')
            .select('*')
            .range(start, end)
            .order('start_date_time', { ascending: false })
            .order(order, { ascending: false })
            .textSearch('video_platform', bull)
      : //검색을 하는 경우
      partySituation === '모집중'
      ? await browserClient
          .from('party_info')
          .select('*')
          .range(start, end)
          .order('start_date_time', { ascending: false })
          .order(order, { ascending: false })
          .textSearch('video_platform', bull)
          .gte('start_date_time', now)
          .eq('situation', '모집중')
          .textSearch('video_name', wordConversion)
      : partySituation === '시청중'
      ? await browserClient
          .from('party_info')
          .select('*')
          .range(start, end)
          .order('start_date_time', { ascending: false })
          .order(order, { ascending: false })
          .lte('start_date_time', now)
          .gte('end_time', now)
          .textSearch('video_platform', bull)
          .textSearch('video_name', wordConversion)
      : await browserClient
          .from('party_info')
          .select('*')
          .range(start, end)
          .order('start_date_time', { ascending: false })
          .order(order, { ascending: false })
          .textSearch('video_platform', bull)
          .textSearch('video_name', wordConversion);

  if (response.error) {
    return [];
  }

  return response.data;
};

export default getRecruitList;
