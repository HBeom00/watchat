import browserClient from '@/utils/supabase/client';

export type User = {
  id: string;
  email?: string;
};

export const updateUserProfile = async (
  user: User | null, // Supabase에서 가져오는 사용자 정보 타입
  file: File | null,
  profile_image_name: string,
  nickname: string,
  platforms: string[],
  genres: string[],
  deleteOldImages: (userId: string, currentImageName: string) => Promise<void> // 기존 이미지 삭제 함수
) => {
  if (!user) {
    throw new Error('사용자 정보가 없습니다.');
  }

  const profileImgUrl = browserClient.storage.from('profile_image').getPublicUrl(profile_image_name).data.publicUrl;

  await deleteOldImages(user.id, profile_image_name); // 기존 이미지 삭제
  await browserClient
    .from('user')
    .update({
      nickname,
      profile_img: profileImgUrl,
      platform: platforms,
      genre: genres
    })
    .eq('user_id', user.id);
};

export const registerUser = async (
  user: User | null,
  file: File | null,
  profile_image_name: string,
  nickname: string,
  platforms: string[],
  genres: string[]
) => {
  if (!user) {
    throw new Error('사용자 정보가 없습니다.');
  }

  const profileImgUrl = browserClient.storage.from('profile_image').getPublicUrl(profile_image_name).data.publicUrl;

  await browserClient
    .from('user')
    .insert({
      user_id: user.id,
      user_email: user.email,
      nickname,
      profile_img: profileImgUrl,
      platform: platforms,
      genre: genres
    })
    .eq('user_id', user.id);
};
