'use client';

import React, { useEffect, useState, useRef } from 'react';
import SendMessageForm from './SendMessageForm';
import Image from 'next/image';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import award_image from '../../../public/award_star.svg';
import { UserInfo } from '@/types/teamUserProfile';
import { ChatInfo } from '@/types/chatInfo';

export default function Chat({ roomId }: { roomId: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // 로그인 유저 아이디 가져오기
    const fetchUserId = async () => {
      const user_id: string | null = await getLoginUserIdOnClient();
      if (user_id) {
        setUserId(user_id);
      }
    };
    fetchUserId();
  }, []);

  // 실시간 메시지 구독 설정
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
      .subscribe();

    return () => {
      messageSubscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, queryClient]);

  // 파티 소유자 ID 가져오기
  const { data: ownerId } = useQuery({
    queryKey: ['partyOwner', roomId],
    queryFn: async () => {
      const { data, error } = await browserClient.from('party_info').select('owner_id').eq('party_id', roomId).single();
      if (error) {
        console.error('Error fetching owner ID:', error);
        return '';
      }
      return data?.owner_id;
    }
  });

  // 초기 메세지 불러오기
  const { data: messages = [] } = useQuery<ChatInfo[], Error>({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      const { data, error } = await browserClient
        .from('chat')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
      return data;
    }
  });

  // 채팅방에 참여한 유저 정보 가져오기
  const { data: userData = [] } = useQuery<UserInfo[], Error>({
    queryKey: ['userData', roomId],
    queryFn: async () => {
      const { data: userData, error: userDateError } = await browserClient
        .from('team_user_profile')
        .select()
        .eq('party_id', roomId);

      if (userDateError) {
        console.error('Error fetching messages:', userDateError);
        return [];
      }
      return userData;
    }
  });

  // 새 메시지를 캐시에 추가하고 자동으로 스크롤 이동
  const displayNewMessage = (message: ChatInfo) => {
    queryClient.setQueryData<ChatInfo[]>(['messages', roomId], (oldMessages = []) => [...oldMessages, message]);
  };

  // 화면 처음 로드될 때 스크롤을 하단으로 설정
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <div ref={messageListRef} className="chatting_height custom-chat-scrollbar overflow-x-hidden">
        {messages.map((msg, index) => {
          const isMyself = msg.sender_id === userId;
          const showProfile = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
          const createdAt = new Date(msg.created_at);
          createdAt.setHours(createdAt.getHours() + 9);

          return (
            <div key={msg.id} className={`message mt-1 mb-[3px] ${isMyself ? 'text-right' : 'text-left'}`}>
              {showProfile && (
                <div className={`flex items-center px-4 gap-2 ${isMyself ? 'justify-end' : 'justify-start'}`}>
                  {!isMyself && (
                    <Image
                      src={
                        userData.filter((el) => el.user_id === msg.sender_id)[0]?.profile_image ||
                        'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/default_profile.png'
                      }
                      alt="profile_image"
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8"
                    />
                  )}
                  {!isMyself ? (
                    ownerId === msg.sender_id ? (
                      <div className="flex justify-center items-center gap-1 body-xs text-Grey-900">
                        {userData.filter((el) => el.user_id === msg.sender_id)[0]?.nickname || '익명'}
                        <Image src={award_image} alt="award_image" width={20} height={20} />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center body-xs text-Grey-900">
                        {userData.filter((el) => el.user_id === msg.sender_id)[0]?.nickname || '익명'}
                      </div>
                    )
                  ) : (
                    ''
                  )}
                </div>
              )}
              <div className={'content mb-2'}>
                {isMyself ? (
                  <div className="flex justify-end items-end pl-[54px] pr-4 gap-1">
                    <span className="text-Grey-600 text-center caption-m">
                      {createdAt.toISOString().slice(11, 16).split('T').join(' ')}
                    </span>
                    <div className="px-4 py-2 justify-center items-center rounded-[19px] bg-primary-400 body-s text-white">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start items-end px-[54px] gap-1">
                    <div className="px-4 py-2 justify-center items-center rounded-[19px] bg-white body-s text-Grey-500">
                      {msg.content}
                    </div>
                    <span className="text-Grey-600 text-center caption-m">
                      {createdAt.toISOString().slice(11, 16).split('T').join(' ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <SendMessageForm roomId={roomId} />
    </div>
  );
}
