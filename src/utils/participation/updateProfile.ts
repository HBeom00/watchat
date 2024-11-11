import partyProfileImageUploader from '../partyProfileImageUploader';
import browserClient from '../supabase/client';

const updateProfile = async (
  nickname: string,
  selectImg: File | undefined,
  upload_profile_img: string,
  party_id: string,
  user_Id: string
) => {
  // 이미지 업서트하기
  if (selectImg) {
    upload_profile_img = await partyProfileImageUploader(selectImg, party_id, user_Id); // 선택된 이미지가있다면 선택된 이미지를 스토리지에 올리고 newProfileImgURL에 선언
  }

  // 프로필 업데이트
  const { error: upDateError } = await browserClient
    .from('team_user_profile')
    .update({ nickname, profile_image: upload_profile_img })
    .eq('party_id', party_id)
    .eq('user_id', user_Id);
  if (upDateError) {
    return false;
  }
  return true;
};

export default updateProfile;
