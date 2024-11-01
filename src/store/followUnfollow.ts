import browserClient from '@/utils/supabase/client';

// 팔로우 취소 함수
export const unfollow = async (userId: string, followId: string) => {
  const { data, error } = await browserClient.from('follow').delete().match({ user_id: userId, follow_id: followId });

  if (error) {
    console.error('팔로우 취소에 실패했습니다.');
  }
  if (data) {
    console.log('팔로우가 취소 됐습니다.');
  }
};

// 팔로우 함수
export const follow = async (userId: string, followId: string) => {
  const { data: addFollow, error: errorAddFollow } = await browserClient
    .from('follow')
    .insert({ follow_key: crypto.randomUUID(), user_id: userId, follow_id: followId });

  if (errorAddFollow) {
    console.error('팔로우에 실패했습니다.');
  }
  if (addFollow) {
    console.log('팔로우됐습니다.');
  }
};
