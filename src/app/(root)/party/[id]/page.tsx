import { createClient, getLoginUserIdOnServer } from '@/utils/supabase/server';
import PartyHeader from './(components)/PartyHeader';

import { PostgrestSingleResponse } from '@supabase/supabase-js';
import PartyBottom from './(components)/PartyBottom';
import PlayBar from './(components)/PlayBar';

export type partyInfo = {
  party_id: string;
  party_name: string;
  party_detail: string | null;
  video_name: string;
  video_platform: string;
  video_image: string;
  limited_member: number;
  duration_time: number;
  situation: string | null;
  owner_id: string;
  video_id: number;
  media_type: string;
  watch_date: string;
  start_time: string;
  episode_number: number | null;
};

const partyPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  const userId = await getLoginUserIdOnServer();

  // 현재 파티 정보 불러오기
  const res: PostgrestSingleResponse<partyInfo[]> = await supabase
    .from('party_info')
    .select('*')
    .eq('party_id', params.id);

  if (res.error || !(res.data.length > 0)) {
    throw new Error('파티정보를 불러올 수 없습니다');
  }

  // 종료된 파티이면 버튼 비활성화
  let end = false;
  const partyData: partyInfo = res.data[0];
  if (partyData.situation === '종료') {
    end = true;
  }

  return (
    <div className="flex flex-col w-full bg-black text-white">
      <PartyHeader partyData={partyData} userId={userId} end={end} />
      {/* 이쪽 건 예시이고 실제 파티페이지에서는 안 쓰임 */}
      <PlayBar startTime={partyData.start_time} duration={partyData.duration_time} />

      <PartyBottom partyData={partyData} userId={userId} end={end} />
    </div>
  );
};

export default partyPage;

// 오늘이 시청날짜일 때
export const nowWatchingDate = (partyData: partyInfo) => {
  const watchDate = partyData.watch_date?.split('-');
  const nowDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Seoul' }).split('/');
  const nowDateArr = [nowDate[2], nowDate[0], nowDate[1]];
  let today = true;
  for (let i = 0; i < 3; i++) {
    if (watchDate && watchDate[i] !== nowDateArr[i]) {
      today = false;
      break;
    }
  }
  return today;
};
