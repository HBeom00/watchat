import { useQuery } from '@tanstack/react-query';
import browserClient from '../supabase/client';

export const getOtherUserFollowList = async (nickname: string | undefined) => {
  if (!nickname) {
    return { followerCount: 0, followerData: [] };
  }

  // 닉네임을 기반으로 유저 정보를 가져옴
  const { data: userData, error: userError } = await browserClient
    .from('user')
    .select('user_id')
    .eq('nickname', nickname)
    .single();

  if (userError || !userData) {
    console.error('유저 정보를 가져오는데 실패했습니다 => ', userError);
    return { followerCount: 0, followerData: [] };
  }
  console.log('여기 유저가 누구죠', userData);
  const userId = userData.user_id;

  // 팔로우 테이블에서 해당 유저 아이디를 가진 행 가져오기
  const { data: followData, error: followError } = await browserClient.from('follow').select('*').eq('user_id', userId);

  // 팔로우 확인
  if (followError) {
    console.error('팔로워 목록을 가져오는데 실패했습니다 => ', followError);
    return { followerCount: 0, followerData: [] };
  }
  console.log('팔로우된 유저의 ID를 확인할까요 =>', followData); // 팔로우된 유저의 ID들 확인

  // 팔로워수를 followerCount에 담아줌
  const followerCount = followData?.length || 0;

  const otherUserFollowListId = followData.map((f) => f.follow_id);

  console.log('무슨 리스트?', otherUserFollowListId);

  if (followerCount === 0) {
    return { followerCount, followerData: [] };
  }

  const { data: otherFollowUserData } = await browserClient
    .from('user')
    .select('*')
    .in('user_id', otherUserFollowListId);

  console.log('뭐찍히나', otherFollowUserData);

  return { followerCount, followerData: otherFollowUserData };
};
// 위 정보를 비동기로 가져오기
export const useOtherUserFollowData = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ['otherUserFollowData', userId],
    queryFn: () => getOtherUserFollowList(userId || undefined)
  });
};
