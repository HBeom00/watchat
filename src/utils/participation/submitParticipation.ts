import { Dispatch, SetStateAction } from 'react';
import { isMemberExist, memberFullChecker, memberFullSwitch, partySituationChecker } from '../memberCheck';
import saveProfile from './saveProfile';
import updateProfile from './updateProfile';
import { UseMutationResult } from '@tanstack/react-query';

const submitParticipation = async (
  nickname: string,
  selectImg: File | undefined,
  upload_profile_img: string,
  party_id: string,
  user_Id: string,
  setMessage: Dispatch<SetStateAction<string>>,
  deleteInviteMutation: UseMutationResult<void, Error, string, unknown>,
  invite_id?: string
) => {
  // 이미 멤버일 때 프로필 변경
  // 오너의 프로필 설정
  const isMember = await isMemberExist(party_id, user_Id);
  if (isMember) {
    const updateSuccess = await updateProfile(nickname, selectImg, upload_profile_img, party_id, user_Id);

    if (!updateSuccess) {
      alert('프로필 업데이트를 실패했습니다');
    }

    return;
  }

  // 파티 상태 확인하기
  const endCheck = await partySituationChecker(party_id);
  const memberCheck = await memberFullChecker(party_id);
  // 모집마감이거나 멤버가 찼지만 모집마감이 아닌 경우
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

  // 참가하기
  const saveSuccess = await saveProfile(nickname, selectImg, upload_profile_img, party_id, user_Id);
  if (!saveSuccess) {
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

export default submitParticipation;
