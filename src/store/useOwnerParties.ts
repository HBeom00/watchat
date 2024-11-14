// 주최한 파티 목록 비동기로 가져오기

import { useQuery } from '@tanstack/react-query';
import { getOwnerParty } from './getOwnerParties';

export const useOwnerParty = (userId: string) => {
  return useQuery({
    queryKey: ['ownerParty', userId],
    queryFn: () => getOwnerParty(userId)
  });
};
