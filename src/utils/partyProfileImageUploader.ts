// import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { defaultImage } from '@/constants/image';
import browserClient from './supabase/client';

// supabase storage에 이미지 저장
const partyProfileImageUploader = async (file: File, party_id: string, user_id: string | null) => {
  // 프로필 id를 기반으로 이미지 업로드하기
  const profile_image_name = `${party_id}/${user_id}`;

  const { data } = await browserClient.storage.from('team_user_profile_image').upload(profile_image_name, file, {
    cacheControl: 'no-store',
    upsert: true
  });

  if (data) {
    const newImageUrl = browserClient.storage.from('team_user_profile_image').getPublicUrl(profile_image_name)
      .data.publicUrl;

    return newImageUrl;
  }

  return defaultImage;
};

export default partyProfileImageUploader;
