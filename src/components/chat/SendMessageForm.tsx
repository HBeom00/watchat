'use client';

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SendMessageForm({ roomId }: { roomId: string }) {
  const [content, setContent] = useState('');
  const route = useRouter();

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        room_id: roomId
      }
    ]);

    if (error) console.error('Error sending message:', error);
    else setContent('');
  };

  return (
    <form
      onSubmit={sendMessage}
      className={`
    w-[700px] flex flex-col items-start bg-Grey-50
    mobile:w-[375px]
    `}
    >
      <div className="flex px-[20px] items-center self-stretch gap-2 bg-white">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메시지를 입력하세요."
          className="body-m text-Grey-800 flex-1 px-4 py-3 outline-none focus:outline-none"
        />
        <button
          type="submit"
          disabled={content === ''}
          className={`${content === '' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {content === '' ? (
            <Image src="/arrow_circle_off.svg" alt="arrow_circle_off" width={24} height={24} />
          ) : (
            <Image src="/arrow_circle_on.svg" alt="arrow_circle_on" width={24} height={24} />
          )}
        </button>
      </div>
    </form>
  );
}
