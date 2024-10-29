'use client';

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function SendMessageForm({ roomId }: { roomId: string }) {
  const [content, setContent] = useState('');

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userId = await getLoginUserIdOnClient();
    const { error } = await browserClient.from('chat').insert([{ content, sender_id: userId, room_id: roomId }]);

    if (error) console.error('Error sending message:', error);
    else setContent(''); // 메시지 전송 후 입력란 초기화
  };

  return (
    <form onSubmit={sendMessage} style={{ display: 'flex', gap: '5px' }}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="메시지를 입력하세요"
        style={{ flex: 1 }}
      />
      <button type="submit">전송</button>
    </form>
  );
}
