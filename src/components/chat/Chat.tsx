'use client';

import browserClient from '@/utils/supabase/client';
import React, { useEffect, useState, useRef } from 'react';
import SendMessageForm from './SendMessageForm';
import Image from 'next/image';

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
  const [messages, setMessages] = useState<Chat[]>([]);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 로그인한 사용자 유저 아이디 가져오기
    const fetchUserId = async () => {
      const {
        data: { user },
        error
      } = await browserClient.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      setUserId(user?.id || null);
    };

    fetchUserId();

    // 메시지 초기 불러오기
    const fetchMessages = async () => {
      const { data, error } = await browserClient
        .from('chat')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data);
    };

    fetchMessages();

    // 실시간 메시지 구독
    const messageSubscription = browserClient
      .channel('realtime:chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, (payload) => {
        displayNewMessage(payload.new as Chat);
      })
      .subscribe();

    return () => {
      browserClient.removeChannel(messageSubscription); // 컴포넌트 언마운트 시 구독 해제
    };
  }, []);

  // 새 메시지를 화면에 표시하는 함수
  const displayNewMessage = (message: Chat) => {
    setMessages((prev) => [...prev, message]);

    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div
        ref={messageListRef}
        style={{
          height: '500px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px'
        }}
      >
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
                  {!isMyself && <div>{msg.nickname}</div>}
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
