'use client';

import browserClient from '@/utils/supabase/client';
import React, { useEffect, useState, useRef } from 'react';
import SendMessageForm from './SendMessageForm';

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
  const [messages, setMessages] = useState<Chat[]>([]);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 메시지 초기 불러오기
    const fetchMessages = async () => {
      const { data, error } = await browserClient.from('chat').select('*').order('created_at', { ascending: true });

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

    // 자동 스크롤
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  return (
    <div>
      <div
        ref={messageListRef}
        style={{
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px'
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <span className="username">
              {msg.profile_image}
              {msg.nickname}
            </span>
            : <span className="content">{msg.content}</span>
          </div>
        ))}
      </div>
      <SendMessageForm roomId={roomId} />
    </div>
  );
}
