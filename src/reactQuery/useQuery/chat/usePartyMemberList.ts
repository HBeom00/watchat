'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKey } from '../../queryKeys';
import { getPartyMemberList } from '../../queryFunc/chat/getPartyMemberList';
import { UserInfo } from '@/types/teamUserProfile';

export const usePartyMemberList = (roomId: string) => {
  return useQuery<UserInfo[], Error>({
    queryKey: queryKey.chat.members(roomId),
    queryFn: () => getPartyMemberList(roomId)
  });
};
