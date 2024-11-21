'use client';

import { useQuery } from '@tanstack/react-query';
import { getOwnerId } from '../../queryFunc/chat/getOwnerId';
import { queryKey } from '../../queryKeys';

export const useOwnerId = (roomId: string) => {
  return useQuery({
    queryKey: queryKey.chat.ownerId(roomId),
    queryFn: () => getOwnerId(roomId)
  });
};
