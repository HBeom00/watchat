// 팔로우 추천 목록 비동기로 가져오기

import { useQuery } from '@tanstack/react-query';
import { getRecommendedMembers } from './getRecommendedUser';

export const useRecommendedUsers = () => {
  return useQuery({
    queryKey: ['recommendedUser'],
    queryFn: () => getRecommendedMembers()
  });
};
