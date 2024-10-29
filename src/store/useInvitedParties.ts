import { useQuery } from '@tanstack/react-query';
import { getInvitedParties } from './getInvitedParties';

// 초대받은 파티목록을 비동기로 가져오기
export const useInvitedParties = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['invitedParties', userId],
    queryFn: () => getInvitedParties()
  });
};
