'use client';

import React, { useEffect, useState, useRef } from 'react';
import SendMessageForm from './SendMessageForm';
import Image from 'next/image';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import award_image from '../../../public/award_star.svg';

type Chat = {
  id: string;
  sender_id: string;
  room_id: string;
  content: string;
  nickname: string;
  profile_image: string;
  created_at: string;
};

export default function Chat({ roomId }: { roomId: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [specialMessage, setSpecialMessage] = useState<string | null>(null);
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
          displayNewMessage(payload.new as Chat);
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
  const { data: messages = [] } = useQuery<Chat[], Error>({
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

  // 새 메시지를 캐시에 추가하고 자동으로 스크롤 이동
  const displayNewMessage = (message: Chat) => {
    queryClient.setQueryData<Chat[]>(['messages', roomId], (oldMessages = []) => [...oldMessages, message]);
  };

  useEffect(() => {
    const checkEventTime = async () => {
      const { data, error } = await browserClient
        .from('party_info')
        .select('watch_date, start_time')
        .eq('party_id', roomId)
        .single();

      if (error) {
        console.error('Error fetching event time:', error);
        return;
      }

      const watchDate = data?.watch_date;
      const startTime = data?.start_time?.split('.')[0];

      if (watchDate && startTime) {
        const eventDateTime = new Date(`${watchDate}T${startTime}`);
        const tenMinutesBefore = new Date(eventDateTime.getTime() - 10 * 60 * 1000);

        const intervalId = setInterval(() => {
          const now = new Date();

          if (now >= eventDateTime) {
            setSpecialMessage('다들 영상을 재생해주세요.');
            clearInterval(intervalId); // 이벤트 시간이 지나면 타이머 중지
          } else if (now >= tenMinutesBefore && now < eventDateTime) {
            setSpecialMessage('곧 영상이 시작합니다. 자리에 착석해 주세요.');
          } else {
            setSpecialMessage('시작 전 입니다.'); // 아무 메시지도 필요하지 않으면 null로 설정
          }
        }, 1000); // 1초마다 확인

        return () => clearInterval(intervalId);
      }
    };

    checkEventTime();
  }, [roomId]);

  // 화면 처음 로드될 때 스크롤을 하단으로 설정
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <div ref={messageListRef} className="h-[846px] custom-chat-scrollbar overflow-x-hidden">
        {specialMessage && (
          <div className="w-[700px] p-4 flex flex-col items-start bg-Grey-50">
            <div className="flex py-4 justify-center items-center self-stretch rounded-lg bg-white text-Grey-900 text-center body-s">
              {specialMessage}
            </div>
          </div>
        )}
        {messages.map((msg, index) => {
          const isMyself = msg.sender_id === userId;
          const showProfile = index === 0 || messages[index - 1].sender_id !== msg.sender_id;

          return (
            <div
              key={msg.id}
              className="message"
              style={{
                marginBottom: '5px',
                textAlign: isMyself ? 'right' : 'left'
              }}
            >
              {showProfile && (
                <div className={`flex items-center px-4 gap-2 ${isMyself ? 'justify-end' : 'justify-start'}`}>
                  {!isMyself && (
                    <Image
                      src={msg.profile_image}
                      alt={msg.profile_image}
                      width={32}
                      height={32}
                      className="rounded-full h-auto w-auto"
                    />
                  )}
                  {!isMyself ? (
                    ownerId === msg.sender_id ? (
                      <div className="flex justify-center items-center gap-1">
                        {msg.nickname}
                        <Image src={award_image} alt="award_image" width={20} height={20} />
                      </div>
                    ) : (
                      <div>{msg.nickname}</div>
                    )
                  ) : (
                    ''
                  )}
                </div>
              )}
              <div className={'content  mb-2'}>
                {isMyself ? (
                  <div className="flex justify-end items-end pl-[54px] pr-4">
                    <span className="text-Grey-600 text-center caption-m">
                      {msg.created_at.slice(11, 16).split('T').join(' ')}
                    </span>
                    <div className="px-4 py-2 justify-center items-center rounded-[19px] text-white body-s bg-primary-400">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start items-end px-[54px]">
                    <div className="px-4 py-2 body-s rounded-[19px] bg-white">{msg.content}</div>
                    <span className="text-Grey-600 text-center caption-m">
                      {msg.created_at.slice(11, 16).split('T').join(' ')}
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
