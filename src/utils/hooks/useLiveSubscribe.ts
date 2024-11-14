'use client';

import { useEffect } from 'react';
import browserClient from '../supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { UserInfo } from '@/types/teamUserProfile';
import { ChatInfo } from '@/types/chatInfo';
import { queryKey } from '@/reactQuery/queryKeys';

export const useLiveSubscribe = (roomId: string) => {
  const queryClient = useQueryClient();

  // 실시간 구독 설정
  useEffect(() => {
    const channel: RealtimeChannel = browserClient
      .channel(`chat-${roomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'team_user_profile' }, (payload) => {
        console.log(payload, 'payload');
        queryClient.setQueryData<UserInfo[]>(['members', roomId], (oldMembers = []) => [
          ...oldMembers,
          payload.new as UserInfo
        ]);

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

        // 채팅 메시지 캐시에 시스템 메시지 추가
        queryClient.setQueryData<ChatInfo[]>(queryKey.chat.messages(roomId), (oldMessages = []) => [
          ...oldMessages,
          joinMessage
        ]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'team_user_profile' }, (payload) => {
        queryClient.setQueryData<UserInfo[]>(queryKey.chat.members(roomId), (oldMembers = []) =>
          oldMembers.filter((member) => member.profile_id !== payload.old.profile_id)
        );
      })
      .subscribe();

    return () => {
      browserClient.removeChannel(channel); // 컴포넌트 언마운트 시 구독 해제
    };
  }, [roomId, queryClient]);
};
