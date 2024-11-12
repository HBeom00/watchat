'use client';

import { ChatInfo } from '@/types/chatInfo';
import { useQuery } from '@tanstack/react-query';
import { queryKey } from '../../queryKeys';
import { getChatMessage } from '../../queryFunc/chat/getChatMessage';

export const useChatMessage = (roomId: string) => {
  return useQuery<ChatInfo[], Error>({
    queryKey: queryKey.chat.messages(roomId),
    queryFn: () => getChatMessage(roomId)
  });
};
