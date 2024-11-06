import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from './supabase/client';

const getRecruitListPage = async (
  wordConversion: string,
  partySituation: string | null,
  order: string,
  bull: string,
  now: string,
  pageSlice: number
) => {
  const response: PostgrestSingleResponse<{ party_id: string }[]> =
    wordConversion === '+'
      ? // 검색을 안하는 경우
        partySituation === '모집중'
        ? await browserClient
            .from('party_info')
            .select('party_id')
            .order('start_date_time', { ascending: false })
            .order(order, { ascending: false })
            .gte('start_date_time', now)
            .eq('situation', '모집중')
            .textSearch('video_platform', bull)
        : partySituation === '시청중'
        ? await browserClient
            .from('party_info')
            .select('party_id')
            .order('start_date_time', { ascending: false })
            .order(order, { ascending: false })
            .lte('start_date_time', now)
            .gte('end_time', now)
            .textSearch('video_platform', bull)
        : await browserClient
            .from('party_info')
            .select('party_id')
            .order('start_date_time', { ascending: false })
            .order(order, { ascending: false })
            .textSearch('video_platform', bull)
      : // 검색을 하는 경우
      partySituation === '모집중'
      ? await browserClient
          .from('party_info')
          .select('party_id')
          .order('start_date_time', { ascending: false })
          .order(order, { ascending: false })
          .textSearch('video_platform', bull)
          .gte('start_date_time', now)
          .eq('situation', '모집중')
          .textSearch('video_name', wordConversion)
      : partySituation === '시청중'
      ? await browserClient
          .from('party_info')
          .select('party_id')
          .order('start_date_time', { ascending: false })
          .order(order, { ascending: false })
          .lte('start_date_time', now)
          .gte('end_time', now)
          .textSearch('video_platform', bull)
          .textSearch('video_name', wordConversion)
      : await browserClient
          .from('party_info')
          .select('party_id')
          .order('start_date_time', { ascending: false })
          .order(order, { ascending: false })
          .textSearch('video_platform', bull)
          .textSearch('video_name', wordConversion);
  if (response.error) {
    return 1;
  }

  return response.data && response.data.length > 0 ? Math.ceil(response.data?.length / pageSlice) : 1;
};
export default getRecruitListPage;
