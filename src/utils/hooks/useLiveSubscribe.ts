'use client';

import { useEffect } from 'react';
import browserClient from '../supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';
import { UserInfo } from '@/types/teamUserProfile';
import { queryKey } from '@/reactQuery/queryKeys';

export const useLiveSubscribe = (roomId: string, queryClient: QueryClient) => {
  // 실시간 구독 설정
  useEffect(() => {
    const channel: RealtimeChannel = browserClient
      .channel(`team_user_profile`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'team_user_profile' }, (payload) => {
        queryClient.setQueryData<UserInfo[]>(['members', roomId], (oldMembers = []) => [
          ...oldMembers,
          payload.new as UserInfo
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
