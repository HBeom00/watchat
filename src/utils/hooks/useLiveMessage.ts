'use client';

import { useEffect } from 'react';
import browserClient from '../supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { ChatInfo } from '@/types/chatInfo';
import { queryKey } from '@/reactQuery/queryKeys';
import { UserInfo } from '@/types/teamUserProfile';

export const useLiveMessage = (roomId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const messageSubscription = browserClient
      .channel(`chat-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat', filter: `room_id=eq.${roomId}` },
        (payload) => {
          displayNewMessage(payload.new as ChatInfo);
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'team_user_profile', filter: `party_id=eq.${roomId}` },
        (payload) => {
          console.log(payload, 'payload');
          addNewUserInfo(payload.new as UserInfo);

          // 새로운 멤버 입장 메시지 생성
          const joinMessage = {
            sender_id: payload.new.user_id,
            room_id: roomId,
            content: `${payload.new.nickname}님이 입장하셨습니다.`,
            created_at: new Date().toISOString(),
            system_message: true
          };

          const insertNewChat = async () => {
            const { error } = await browserClient.from('chat').insert(joinMessage);

            if (error) {
              console.error('error', error.message);
              return;
            }
          };
          insertNewChat();

          addinsertUserMessage(joinMessage);
        }
      )
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, queryClient]);

  // 새 메시지를 캐시에 추가
  const displayNewMessage = (message: ChatInfo) => {
    queryClient.setQueryData<ChatInfo[]>(queryKey.chat.messages(roomId), (oldMessages = []) => [
      ...oldMessages,
      message
    ]);
  };

  // 뉴 유저를 캐시에 추가
  const addNewUserInfo = (info: UserInfo) => {
    queryClient.setQueryData<UserInfo[]>(queryKey.chat.members(roomId), (oldMembers = []) => [...oldMembers, info]);
  };

  // 입장 메세지
  const addinsertUserMessage = (notifyMsg: ChatInfo) => {
    queryClient.setQueryData<ChatInfo[]>(queryKey.chat.messages(roomId), (oldMessages = []) => [
      ...oldMessages,
      notifyMsg
    ]);
  };
};
