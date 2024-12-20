// 팔로잉 데이터를 비동기로 가져오기

import { useQuery } from '@tanstack/react-query';
import { getFollowerData } from './getFollowData';

export const useFollowData = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['followingUsers', userId],
    queryFn: () => getFollowerData(userId)
  });
};
