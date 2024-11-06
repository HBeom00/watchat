import { createClient } from '@/utils/supabase/server';
import PartyHeader from './(components)/PartyHeader';

import { PostgrestSingleResponse } from '@supabase/supabase-js';
import PartyBottom from './(components)/PartyBottom';
import { partyInfo } from '@/types/partyInfo';
import { chatOpenClose } from '@/utils/chatOpenClose';
import { Suspense } from 'react';

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();

  // 현재 파티 정보 불러오기
  const res: PostgrestSingleResponse<partyInfo[]> = await supabase
    .from('party_info')
    .select('*')
    .eq('party_id', params.id);

  return { title: `${res.data ? res.data[0].party_name : ''} 페이지` };
};

const partyPage = async ({ params }: { params: { id: string } }) => {
  const supabase = createClient();

  // 현재 파티 정보 불러오기
  const res: PostgrestSingleResponse<partyInfo[]> = await supabase
    .from('party_info')
    .select('*')
    .eq('party_id', params.id);

  if (res.error || !(res.data.length > 0)) {
    throw new Error('파티정보를 불러올 수 없습니다');
  }

  // 종료된 파티이면 버튼 비활성화
  const partyData: partyInfo = res.data[0];
  const end = chatOpenClose(partyData) === '시청완료';

  return (
    <div className="flex flex-col w-[1060px] m-auto">
      <Suspense>
        <PartyHeader partyData={partyData} end={end} />
        <PartyBottom partyData={partyData} end={end} partyOwner={partyData.owner_id} />
      </Suspense>
    </div>
  );
};

export default partyPage;
