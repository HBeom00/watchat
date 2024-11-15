import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from '../../../utils/supabase/client';
import { nowTime, pageSlice, platformConversion } from '@/utils/mainPageData/pageFilter';

const getRecruitListPage = async (partySituation: string | null, filter: string) => {
  const response: PostgrestSingleResponse<{ party_id: string }[]> =
    partySituation === 'recruiting'
      ? await browserClient
          .from('party_info')
          .select('party_id')
          .gte('start_date_time', nowTime())
          .eq('situation', '모집중')
          .textSearch('video_platform', platformConversion(filter))
      : partySituation === 'current'
      ? await browserClient
          .from('party_info')
          .select('party_id')
          .lte('start_date_time', nowTime())
          .gte('end_time', nowTime())
          .textSearch('video_platform', platformConversion(filter))
      : await browserClient
          .from('party_info')
          .select('party_id')
          .gte('end_time', nowTime()) // 종료 시간이 지나지 않은 경우만
          .textSearch('video_platform', platformConversion(filter));

  if (response.error) {
    return 1;
  }

  return response.data && response.data.length > 0 ? Math.ceil(response.data?.length / pageSlice) : 1;
};
export default getRecruitListPage;
