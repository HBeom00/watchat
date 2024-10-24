import browserClient from '@/utils/supabase/client';
import { getUserId } from './getUserId';

//초대하기 로직
export const inviteHandler = async (party_id: string, invitee: string) => {
  const inviter = await getUserId();

  // 초대하기 전에 모집이 마감되거나 종료된 파티인지 확인

  // 초대하기 전에 이미 초대를 보냈는지 확인
  const { data } = await browserClient
    .from('invite')
    .select('*')
    .eq('inviter', inviter)
    .eq('invitee', invitee)
    .eq('party_id', party_id);
  if (data !== null) {
    alert('이미 초대장을 보냈습니다.');
    return;
  }

  // 초대하기(테스트가 필요함)
  const response = await browserClient.from('invited').insert({ inviter, invitee, party_id });
  console.log(response);

  // 이 초대하기로 인해 인원이 가득 찼다면 파티 상태를 모집 마감으로 전환

  // if(response.error){
  //   alert('초대장 보내기를 실패했습니다.')
  // } else {
  //   alert('초대장을 보냈습니다')
  // }
};
