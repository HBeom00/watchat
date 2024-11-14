import { UseMutationResult } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { memberFullChecker, memberFullSwitch, partySituationChecker } from '../memberCheck';
import browserClient from '../supabase/client';
import { defaultImage } from '@/constants/image';

const skipParticipation = async (
  nickname: string | undefined,
  profile_image: string | undefined,
  party_id: string,
  setMessage: Dispatch<SetStateAction<string>>,
  deleteInviteMutation: UseMutationResult<void, Error, string, unknown>,
  invite_id?: string
) => {
  // 파티 상태 확인하기
  const endCheck = await partySituationChecker(party_id);
  const memberCheck = await memberFullChecker(party_id);
  if (endCheck === '모집마감' || (memberCheck && endCheck !== '모집마감')) {
    if (memberCheck && endCheck !== '모집마감') {
      // 모집 마감으로 전환
      await memberFullSwitch(party_id);
    }
    setMessage('마감된 파티입니다');
    // 초대된 상태면 초대 목록에서 해당 초대를 삭제
    if (invite_id) {
      deleteInviteMutation.mutate(invite_id);
    }
    return;
  }

  const { error: participationError } = await browserClient.from('team_user_profile').insert({
    nickname: nickname || '익명',
    profile_image: profile_image || defaultImage,
    party_id
  });

  if (participationError) {
    alert('파티에 참가할 수 없습니다');
    return;
  }

  // 이 참가하기로 인해 인원이 가득 찼다면 파티 상태를 모집 마감으로 전환
  // 모집 마감 상태로 전환
  await memberFullSwitch(party_id);

  // 초대된 상태면 초대 목록에서 해당 초대를 삭제
  if (invite_id) {
    deleteInviteMutation.mutate(invite_id);
  }
  setMessage('파티에 참가하신 걸 환영합니다!');
};

export default skipParticipation;
