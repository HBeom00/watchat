import { createClient, getLoginUserIdOnServer } from '@/utils/supabase/server';
import PartyHeader from './(components)/PartyHeader';

import { PostgrestSingleResponse } from '@supabase/supabase-js';
import PartyBottom from './(components)/PartyBottom';
import PlayBar from './(components)/PlayBar';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
  owner_id: string | null;
  video_id: number | null;
  media_type: string | null;
  watch_date: string | null;
  end_time: string | null;
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

  // 종료된 파티이면 홈으로 리다이렉트
  const partyData: partyInfo = res.data[0];
  if (partyData.situation === '종료') {
    redirect('/');
  }

  // 오늘이 시청날짜일 때
  const nowWatchingDate = () => {
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
  nowWatchingDate();
  const isOwner = partyData.owner_id === userId;
  return (
    <div className="flex flex-col w-full bg-black text-white">
      <PartyHeader partyNumber={params.id} partyData={partyData} />
      <PlayBar startTime={partyData.start_time} duration={partyData.duration_time} />
      {nowWatchingDate() ? (
        <>
          <Link href={`chat/${params.id}`}>채팅하기</Link>
          <PlayBar startTime={partyData.start_time} duration={partyData.duration_time} />
        </>
      ) : (
        <></>
      )}
      <PartyBottom partyData={partyData} isOwner={isOwner} userId={userId} />
    </div>
  );
};

export default partyPage;
