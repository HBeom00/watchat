'use client';

import { useEffect } from 'react';
import browserClient from '../supabase/client';
import { ChatInfo } from '@/types/chatInfo';
import { useQueryClient } from '@tanstack/react-query';

export const useLiveMessage = (roomId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const messageSubscription = browserClient
      .channel(`chat-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat', filter: `room_id=eq.${roomId}` },
        (payload) => {
          console.log(payload, 'payload 값 확인 입니다.');
          queryClient.setQueryData<ChatInfo[]>(['messages', roomId], (oldMessages = []) => [
            ...oldMessages,
            payload.new as ChatInfo
          ]);
        }
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, queryClient]);

  // 새 메시지를 캐시에 추가하고 자동으로 스크롤 이동
  // const displayNewMessage = (message: ChatInfo) => {
  //   queryClient.setQueryData<ChatInfo[]>(['messages', roomId], (oldMessages = []) => [...oldMessages, message]);
  // };
};
