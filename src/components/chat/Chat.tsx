'use client';

import React, { useEffect, useState, useRef } from 'react';
import SendMessageForm from './SendMessageForm';
import Image from 'next/image';
import { GiQueenCrown } from 'react-icons/gi';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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
            setSpecialMessage('다들 영상을 재생해주세요');
            console.log('1 - 이벤트 시작 시간');
            clearInterval(intervalId); // 이벤트 시간이 지나면 타이머 중지
          } else if (now >= tenMinutesBefore && now < eventDateTime) {
            setSpecialMessage('시작하기 10분 전입니다');
            console.log('2 - 10분 전');
          } else {
            setSpecialMessage('시작 전 입니다.'); // 아무 메시지도 필요하지 않으면 null로 설정
            console.log('3 - 아직 시간 전');
          }
        }, 1000 * 60); // 1분마다 확인

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
      <div
        ref={messageListRef}
        style={{
          height: '500px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px',
          position: 'relative'
        }}
      >
        {specialMessage && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#fff3cd',
              color: '#856404',
              border: '1px solid #ffeeba',
              borderRadius: '5px',
              marginBottom: '10px',
              textAlign: 'center',
              position: 'sticky',
              top: '0'
            }}
          >
            {specialMessage}
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
                <div className={`flex items-center ${isMyself ? 'justify-end' : 'justify-start'}`}>
                  {!isMyself && (
                    <Image
                      src={msg.profile_image}
                      alt={msg.profile_image}
                      width={30}
                      height={30}
                      className="rounded-full mr-2 h-auto w-auto"
                    />
                  )}
                  {!isMyself ? (
                    ownerId === msg.sender_id ? (
                      <div className="flex justify-center items-center gap-1">
                        {msg.nickname}
                        <GiQueenCrown className="text-yellow-400" />
                      </div>
                    ) : (
                      <div>{msg.nickname}</div>
                    )
                  ) : (
                    ''
                  )}
                </div>
              )}
              <div
                className="content"
                style={{
                  marginTop: showProfile ? '8px' : '2px',
                  padding: '5px 10px',
                  backgroundColor: isMyself ? '#DCF8C6' : '#DCF8C6',
                  borderRadius: '15px',
                  maxWidth: '70%',
                  display: 'inline-block'
                }}
              >
                {msg.content}
              </div>
              <p
                style={{
                  color: '#b4b2b2',
                  fontSize: '12px',
                  marginTop: '2px',
                  padding: '0 10px'
                }}
              >
                {msg.created_at.slice(0, 16).split('T').join(' ')}
              </p>
            </div>
          );
        })}
      </div>
      <SendMessageForm roomId={roomId} />
    </div>
  );
}
