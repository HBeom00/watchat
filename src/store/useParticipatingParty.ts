// 내가 참여한 파티 목록 비동기로 가져오기

import { useQuery } from '@tanstack/react-query';
import { getParticipatingParty } from './getParticipatingParty';

export const useParticipatingParty = (userId: string) => {
  return useQuery({
    queryKey: ['participatingParty', userId],
    queryFn: () => getParticipatingParty(userId),
    enabled: !!userId
  });
};
