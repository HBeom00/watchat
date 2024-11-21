import browserClient from '../supabase/client';
import partyProfileImageUploader from './partyProfileImageUploader';

// 참가하기 함수
const saveProfile = async (
  nickname: string,
  selectImg: File | undefined,
  upload_profile_img: string,
  party_id: string,
  user_Id: string
) => {
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
};

export default saveProfile;
