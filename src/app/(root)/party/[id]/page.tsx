import { createClient, getLoginUserIdOnServer } from '@/utils/supabase/server';
import PartyHeader from './(components)/PartyHeader';

import { PostgrestSingleResponse } from '@supabase/supabase-js';
import PartyBottom from './(components)/PartyBottom';
import PlayBar from './(components)/PlayBar';
import { partyInfo } from '@/types/partyInfo';
import { nowWatchingDate } from './dateChecker';

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
  let end: boolean = false;
  const partyData: partyInfo = res.data[0];
  if (partyData.situation === '종료') {
    end = true;
  }

  return (
    <div className="flex flex-col w-full bg-black text-white">
      <PartyHeader partyData={partyData} userId={userId} end={end} />
      {/* 이쪽 건 예시이고 실제 파티페이지에서는 안 쓰임 */}
      {nowWatchingDate(partyData) ? (
        <PlayBar startTime={partyData.start_time} duration={partyData.duration_time} />
      ) : (
        <></>
      )}

      <PartyBottom partyData={partyData} userId={userId} end={end} />
    </div>
  );
};

export default partyPage;
