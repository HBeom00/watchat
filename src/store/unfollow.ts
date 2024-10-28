import browserClient from '@/utils/supabase/client';

export const unfollow = async (userId: string, followId: string) => {
  const { data, error } = await browserClient.from('follow').delete().match({ user_id: userId, follow_id: followId });

  if (error) {
    console.error('언팔로우에 실패했습니다.');
  }
  if (data) {
    console.log('언팔로우 됐습니다.');
  }
};
