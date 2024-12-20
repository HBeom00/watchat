// 팔로잉 목록 가져오기

import { FollowingUser } from '@/types/followingUser';
import browserClient from '@/utils/supabase/client';

// 팔로잉 중인 유저 데이터를 가져옴
export const getFollowerData = async (userId: string | undefined) => {
  if (!userId) {
    return { followerCount: 0, followerData: [] }; // userId가 없으면 빈 값 반환
  }

  // 팔로워 수를 가져옴
  const { data, error } = await browserClient.from('follow').select('follow_id').eq('user_id', userId);

  if (error) {
    console.error('팔로워 수를 가져오는데 실패했습니다 => ', error);
    return 0;
  }

  // 팔로워수를 followerCount에 담아줌
  const followerCount = data?.length || 0;

  if (followerCount === 0) {
    return { followerCount, followerData: [] }; // 팔로워가 없으면 빈 배열 반환
  }

  // 위에서 가져온 follow_id를 가지고 사용자 정보를 가져오기
  if (followerCount > 0) {
  }
  const followIds = data?.map((f) => f.follow_id as string);

  const { data: followingUserData, error: followingUserError } = await browserClient
    .from('user')
    .select('user_id,nickname,profile_img')
    .in('user_id', followIds);

  const followingUsers: FollowingUser[] | null = followingUserData;

  if (followingUserError) {
    console.error('팔로잉 목록 정보를 가져오는데 실패했습니다 => ', followingUserError);
  }

  // 팔로워 정보를 followerData에 담아줌
  return { followerCount, followerData: followingUsers };
};
