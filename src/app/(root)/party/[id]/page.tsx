import { createClient, getLoginUserIdOnServer } from '@/utils/supabase/server';
import PartyHeader from './(components)/PartyHeader';
import DetailInfo from './(components)/DetailInfo';
import MemberList from './(components)/MemberList';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import Owner from './(components)/Owner';

export type partyInfo = {
  party_id: string;
  party_name: string | null;
  party_detail: string | null;
  video_name: string | null;
  video_platform: string | null;
  video_image: string | null;
  limited_member: number | null;
  duration_time: number | null;
  party_end_time: string | null;
  situation: string | null;
  owner_id: string | null;
  video_id: string | null;
  media_type: string | null;
  watch_date: string | null;
  end_time: string | null;
  start_time: string | null;
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
  // if(error){
  //   throw new Error("파티정보를 불러올 수 없습니다")
  // }

  // 데이터 불러올 수 있게 되면 PartyHeader와 DetailInfo로 data 물려주기
  const partyData = res.data
    ? res.data[0]
    : {
        party_id: '',
        party_name: '',
        party_detail: '',
        video_name: '',
        video_platform: '',
        video_image: '',
        limited_member: 0,
        duration_time: 0,
        party_end_time: '',
        situation: '',
        owner_id: '',
        video_id: '',
        media_type: '',
        watch_date: '',
        end_time: '',
        start_time: '',
        episode_number: 0
      };
  const isOwner = partyData.owner_id === userId;
  return (
    <div className="flex flex-col w-full bg-black text-white">
      <PartyHeader partyNumber={params.id} partyData={partyData} />
      <div className="flex flex-row gap-10 w-full h-96 justify-center items-center bg-slate-400">
        <DetailInfo videoNumber={partyData.video_id} videoType={partyData.media_type} />
        <MemberList partyNumber={params.id} userId={userId} isOwner={false} />
        {isOwner ? <Owner partyNumber={params.id} userId={userId} isOwner={isOwner} /> : <></>}
      </div>
    </div>
  );
};

export default partyPage;
