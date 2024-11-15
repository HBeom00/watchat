import browserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

// 다른사람의 프로필 페이지에서의 팔로우/팔로우 취소
//팔로우
export const followUser = async (userId: string, followId: string) => {
  const followKey = crypto.randomUUID(); // 랜덤 UUID 생성
  const { data, error } = await browserClient
    .from('follow')
    .insert([{ user_id: userId, follow_id: followId, follow_key: followKey }]);

  if (error) {
    console.error('팔로우 실패:', error); // 에러 출력
    throw new Error('팔로우 실패');
  }

  return data;
};

//팔로우 취소
export const unfollowUser = async (userId: string, followId: string) => {
  const { data, error } = await browserClient.from('follow').delete().eq('user_id', userId).eq('follow_id', followId);

  if (error) {
    console.error('언팔로우 실패:', error); // 에러 출력
    throw new Error('언팔로우 실패');
  }
  return data;
};

export const useFollowMutation = (userId: string, loginUser: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (followId: string) => followUser(userId, followId),
    onSuccess: () => {
      // 팔로우 성공 시, 관련 데이터를 새로고침
      queryClient.invalidateQueries({ queryKey: ['otherUserFollowData', userId] });
      queryClient.invalidateQueries({ queryKey: ['followingUsers', loginUser] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUser', loginUser] });
    }
  });
};

export const useUunfollowMutation = (userId: string, loginUser: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (followId: string) => unfollowUser(userId, followId),
    onSuccess: () => {
      // 팔로우 성공 시, 관련 데이터를 새로고침
      queryClient.invalidateQueries({ queryKey: ['otherUserFollowData', userId] });
      queryClient.invalidateQueries({ queryKey: ['followingUsers', loginUser] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUser', loginUser] });
    }
  });
};
