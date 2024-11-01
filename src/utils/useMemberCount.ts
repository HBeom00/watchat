// 멤버 수 확인하기

import { useQuery } from '@tanstack/react-query';
import { partyMemberCounter } from './memberCheck';

export const useMemberCount = (party_id: string) => {
  return useQuery({
    queryKey: ['memberCount', party_id],
    queryFn: () => partyMemberCounter(party_id)
  });
};
