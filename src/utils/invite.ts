import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { isMemberExist, partySituationChecker } from './memberCheck';
import { Dispatch, SetStateAction } from 'react';

//초대하기 로직
export const inviteHandler = async (
  party_id: string,
  invitee: string,
  setMessage: Dispatch<SetStateAction<string>>
) => {
  const inviter = await getLoginUserIdOnClient();

  // 초대하기 전에 모집이 마감되거나 종료된 파티인지 확인
  // 파티페이지 버튼으로 빼기
  const endCheck = await partySituationChecker(party_id);
  if (endCheck === '알수없음') {
    setMessage('존재하지 않는 파티입니다.');
    return;
  } else if (endCheck === '모집마감') {
    setMessage('모집이 마감된 파티입니다.');
    return;
  } else if (endCheck === '종료') {
    setMessage('종료된 파티입니다.');
    return;
  }

  // 초대하기 전에 이미 참가한 멤버인지 확인
  const isMember = await isMemberExist(party_id, invitee);
  if (isMember) {
    setMessage('이미 참가한 멤버입니다.');
    return;
  }

  // 초대하기 전에 이미 초대를 받았는지 확인
  const { data } = await browserClient.from('invite').select('*').eq('invitee', invitee).eq('party_id', party_id);
  if (data !== null) {
    setMessage('이미 초대장을 보낸 멤버입니다.');
    return;
  }

  // 초대하기
  const { error } = await browserClient.from('invited').insert({ inviter, invitee, party_id });

  if (error) {
    setMessage('초대장 보내기를 실패했습니다.');
  } else {
    setMessage('초대장을 보냈습니다');
  }
};
