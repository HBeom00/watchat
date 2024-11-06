'use client';

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SendMessageForm({ roomId }: { roomId: string }) {
  const [content, setContent] = useState('');
  const route = useRouter();

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (content === '') {
      alert('내용을 입력하세요.');
      return;
    }

    const userId = await getLoginUserIdOnClient();
    const { data } = await browserClient
      .from('team_user_profile')
      .select()
      .eq('party_id', roomId)
      .eq('user_id', userId);

    if (data?.length === 0) {
      alert('추방 당하였습니다.');
      route.push(`/party/${roomId}`);
      return;
    }

    const { error } = await browserClient.from('chat').insert([
      {
        content,
        sender_id: userId,
        room_id: roomId,
        nickname: data?.[0].nickname,
        profile_image: data?.[0].profile_image
      }
    ]);

    if (error) console.error('Error sending message:', error);
    else setContent('');
  };

  return (
    <form onSubmit={sendMessage} className="w-[700px] px-4 pb-4 flex flex-col items-start gap-2 bg-Grey-50">
      <div className="flex px-4 py-3 items-center self-stretch gap-2 rounded-lg bg-white">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="body-m text-Grey-800 flex-1 px-4 py-3"
        />
        <button
          type="submit"
          disabled={content === ''}
          className={`w-[124px] ${
            content === '' ? 'disabled-btn-m text-gray-400 cursor-not-allowed' : 'btn-m text-black cursor-pointer'
          }`}
        >
          전송
        </button>
      </div>
    </form>
  );
}
