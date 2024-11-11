import browserClient from '../supabase/client';
import partyProfileImageUploader from '../partyProfileImageUploader';

// 참가하기 함수
const saveProfile = async (
  nickname: string,
  selectImg: File | undefined,
  upload_profile_img: string,
  party_id: string,
  user_Id: string
) => {
  // 이미 멤버일 때 프로필 변경
  // 오너의 프로필 설정
  // const isMember = await isMemberExist(party_id, user_Id);

  // if (isMember) {
  //   // 이미지 업서트하기
  //   if (selectImg) {
  //     const newProfileImgURL = await partyProfileImageUploader(selectImg, party_id, user_Id); // 선택된 이미지가있다면 선택된 이미지를 스토리지에 올리고 newProfileImgURL에 선언

  //     if (newProfileImgURL) {
  //       upload_profile_img = newProfileImgURL;
  //     } else if (newProfileImgURL === '') {
  //       alert('이미지업로드에 실패했습니다');
  //       upload_profile_img =
  //         'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/default_profile.png';
  //     }
  //   }

  //   // 프로필 업데이트
  //   const { error: upDateError } = await browserClient
  //     .from('team_user_profile')
  //     .update({ nickname, profile_image: upload_profile_img })
  //     .eq('party_id', party_id)
  //     .eq('user_id', user_Id);
  //   if (upDateError) {
  //     setMessage('프로필 변경을 실패하셨습니다.');
  //     router.replace(`/party/${party_id}`);
  //   }
  //   queryClient.invalidateQueries({ queryKey: ['partyOwnerInfo', party_id] });
  //   router.replace(`/party/${party_id}`);

  //   return;
  // }

  // // 파티 상태 확인하기
  // const endCheck = await partySituationChecker(party_id);
  // const memberCheck = await memberFullChecker(party_id);
  // if (endCheck === '알수없음') {
  //   setMessage('존재하지 않는 파티입니다');
  //   // 초대된 상태면 초대 목록에서 해당 초대를 삭제
  //   if (invite_id) {
  //     deleteInviteMutation.mutate(invite_id);
  //   }

  //   return;
  // } else if (endCheck === '모집마감') {
  //   await memberFullSwitch(party_id);
  //   setMessage('마감된 파티입니다');
  //   // 초대된 상태면 초대 목록에서 해당 초대를 삭제
  //   if (invite_id) {
  //     deleteInviteMutation.mutate(invite_id);
  //   }

  //   return;
  // } else if (endCheck === '종료') {
  //   setMessage('종료된 파티입니다');
  //   // 초대된 상태면 초대 목록에서 해당 초대를 삭제
  //   if (invite_id) {
  //     deleteInviteMutation.mutate(invite_id);
  //   }

  //   return;
  // } else if (memberCheck && endCheck !== '모집마감') {
  //   await memberFullSwitch(party_id);
  //   setMessage('마감된 파티입니다');
  //   // 초대된 상태면 초대 목록에서 해당 초대를 삭제
  //   if (invite_id) {
  //     deleteInviteMutation.mutate(invite_id);
  //   }
  //   return;
  // }

  // 선택된 이미지 selectImg에 선언
  if (selectImg) {
    upload_profile_img = await partyProfileImageUploader(selectImg, party_id, user_Id); // 선택된 이미지가있다면 선택된 이미지를 스토리지에 올리고 newProfileImgURL에 선언
  }

  // 참가하기
  const { error: participationError } = await browserClient.from('team_user_profile').insert({
    nickname,
    profile_image: upload_profile_img,
    party_id
  });

  if (participationError) {
    return false;
  }
  return true;

  // // 멤버 프로필이미지 업데이트
  // const { error } = await browserClient
  //   .from('team_user_profile')
  //   .update({ profile_image: upload_profile_img })
  //   .eq('user_id', user_Id)
  //   .eq('party_id', party_id);
  // if (error) {
  //   setMessage('이미지 업로드에 실패하셨습니다');
  // }
  // 이 참가하기로 인해 인원이 가득 찼다면 파티 상태를 모집 마감으로 전환
  // 인원이 가득찼는지 확인
  // const fullCheck = await memberFullChecker(party_id);
  // if (fullCheck) {
  //   // 모집 마감 상태로 전환
  //   await memberFullSwitch(party_id);
  // }
  // 멤버가 변동하면 바뀌어야 하는 값들
  // queryClient.invalidateQueries({ queryKey: ['partyMember', party_id] });
  // queryClient.invalidateQueries({ queryKey: ['isMember', party_id, user_Id] });
  // queryClient.invalidateQueries({ queryKey: ['myParty', user_Id] });
  // queryClient.invalidateQueries({ queryKey: ['invitedParties', user_Id] });
  // setMessage('파티에 참가하신 걸 환영합니다!');

  // 초대된 상태면 초대 목록에서 해당 초대를 삭제
  // if (invite_id) {
  //   deleteInviteMutation.mutate(invite_id);
  // }

  // if (path.includes('/party')) {
  //   closeHandler(false);
  // } else {
  //   router.replace(`/party/${party_id}`);
  // }
};

export default saveProfile;
