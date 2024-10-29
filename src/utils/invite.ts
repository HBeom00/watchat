import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { isMemberExist, memberFullChecker, memberFullSwitch, partySituationChecker } from './memberCheck';

//초대하기 로직
export const inviteHandler = async (party_id: string, invitee: string) => {
  const inviter = await getLoginUserIdOnClient();

  // 초대하기 전에 모집이 마감되거나 종료된 파티인지 확인
  const endCheck = await partySituationChecker(party_id);
  if (endCheck === '알수없음') {
    alert('존재하지 않는 파티입니다');
    return;
  } else if (endCheck === '모집마감') {
    alert('모집이 마감된 파티입니다');
    return;
  } else if (endCheck === '종료') {
    alert('종료된 파티입니다');
    return;
  }

  // 초대하기 전에 이미 참가한 멤버인지 확인
  const isMember = await isMemberExist(party_id, invitee);
  if (isMember) {
    alert('이미 참가한 사용자입니다.');
    return;
  }

  // 초대하기 전에 이미 초대를 받았는지 확인
  const { data } = await browserClient.from('invite').select('*').eq('invitee', invitee).eq('party_id', party_id);
  if (data !== null) {
    alert('이미 초대장을 받은 사용자입니다.');
    return;
  }

  // 초대하기
  const { error } = await browserClient.from('invited').insert({ inviter, invitee, party_id });

  if (error) {
    alert('초대장 보내기를 실패했습니다.');
  } else {
    // 이 초대하기로 인해 인원이 가득 찼다면 파티 상태를 모집 마감으로 전환
    // 인원이 가득찼는지 확인
    const fullCheck = await memberFullChecker(party_id);
    if (fullCheck) {
      // 모집 마감 상태로 전환
      await memberFullSwitch(party_id);
    }
    alert('초대장을 보냈습니다');
  }
};
