import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from './supabase/client';

// supabase storage에 이미지 저장
const partyProfileImageUploader = async (file: File, party_id: string, user_id: string | null) => {
  // 프로필 id 찾아오기
  const memberIdResponse: PostgrestSingleResponse<{ profile_id: string }[]> = await browserClient
    .from('team_user_profile')
    .select('profile_id')
    .eq('user_id', user_id)
    .eq('party_id', party_id);
  if (!memberIdResponse.data) {
    // console.error('멤버 ID를 가져오는 데 실패했습니다.');
    return ''; // memberId가 유효하지 않으면 빈 문자열 반환
  }

  // 프로필 id를 기반으로 이미지 업로드하기
  const profile_image_name = `${memberIdResponse.data[0].profile_id}`;

  const { data } = await browserClient.storage.from('team_user_profile_image').upload(profile_image_name, file, {
    cacheControl: 'no-store',
    upsert: true
  });

  if (data) {
    // console.log('supabase에 이미지를 업로드 하는데 성공했습니다.');
    const newImageUrl = browserClient.storage.from('team_user_profile_image').getPublicUrl(profile_image_name)
      .data.publicUrl;

    return newImageUrl;
  }

  return '';
};

export default partyProfileImageUploader;
