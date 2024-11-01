import browserClient from '@/utils/supabase/client';

// 추천 목록에서 X버튼을 누르면 해당 유저를 추천 목록에서 밴
export const banUser = async (userId: string, bannedUserId: string) => {
  const { data, error } = await browserClient
    .from('ban_recommend')
    .insert([{ id: crypto.randomUUID(), user_id: userId, banned_user: bannedUserId }]);

  if (error) {
    console.error('사용자 차단에 실패했습니다 =>', error.message);
    throw new Error('사용자 차단에 실패했습니다');
  }
  return data;
};
