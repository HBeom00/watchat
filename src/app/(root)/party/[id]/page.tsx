import { createClient } from '@/utils/supabase/server';
import PartyHeader from './(components)/PartyHeader';
import DetailInfo from './(components)/DetailInfo';
import MemberList from './(components)/MemberList';

const partyPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  // 현재 파티 페이지 정보 가져오기
  const { data, error } = await supabase.from('party_info').select('*').eq('party_id', params.id);
  // if(error){
  //   throw new Error("파티정보를 불러올 수 없습니다")
  // }

  // 데이터 불러올 수 있게 되면 PartyHeader와 DetailInfo로 data 물려주기
  console.log(data, error);
  return (
    <div className="flex flex-col w-full bg-black text-white">
      <PartyHeader partyNumber={params.id} />
      <div className="flex flex-row gap-10 w-full h-96 justify-center items-center bg-slate-400">
        <DetailInfo />
        <MemberList partyNumber={params.id} />
      </div>
    </div>
  );
};

export default partyPage;
