import { createClient } from '@/utils/supabase/server';
import ParticipationForm from '../(components)/ParticipationForm';

const page = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();

  // params를 기반으로 내가 참가하고자 하는 파티의 제목 가져오기
  const { data, error } = await supabase.from('party_info').select('party_name').eq('party_id', params.id);
  // if(error){
  //   throw new Error("파티정보를 가져올 수 없습니다")
  // }
  console.log('데이터와 에러', data, error);

  return (
    <div className="flex justify-center items-center w-full py-28">
      <p>{params.id}에 참가하기</p>

      <div className="flex flex-col gap-9 p-10 bg-slate-400 rounded-2xl">
        <ParticipationForm partyId={params.id} />
      </div>
    </div>
  );
};

export default page;
