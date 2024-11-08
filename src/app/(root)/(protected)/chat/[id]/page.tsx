import PlayBar from '@/components/button/PlayBar';
import Chat from '@/components/chat/Chat';
import SidebarToggle from '@/components/chat/SidebarToggle';
import { createClient } from '@/utils/supabase/server';
import arrow_back from '../../../../../../public/arrow_left_2.svg';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '라이브 채팅방',
  description: '파티 참여자와 실시간 소통할 수 있는 페이지'
};

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const roomId = params.id;

  const { data, error } = await createClient().from('party_info').select().eq('party_id', roomId);

  if (error) {
    console.error('Error fetching party info:', error);
    return <div>Error loading party info.</div>;
  }

  return (
    <div className="flex justify-center relative pt-[200px]">
      <div className="w-[700px] h-[960px] shrink-0 bg-Grey-50">
        <div className="w-[700px] flex flex-col justify-center items-center fixed top-0">
          <div className="flex pt-4 justify-between items-center self-stretch bg-white">
            <div className="flex">
              <Link href={`/party/${roomId}`} className="w-10 p-2 flex justify-between items-center">
                <Image src={arrow_back} alt="back_img" width={24} height={24} className="flex flex-shrink-0" />
              </Link>
              <div className="w-[545px] flex flex-col justify-center items-start">
                <p className="body-l-bold text-center text-Grey-900">{data?.[0].party_name}</p>
                <p className="label-m text-Grey-700">{data?.[0].video_name}</p>
              </div>
            </div>
            <SidebarToggle roomId={roomId} />
          </div>
          <PlayBar startTime={data?.[0].start_date_time} duration={data?.[0].duration_time} />
        </div>
        <Chat roomId={roomId} />
      </div>
    </div>
  );
};

export default ChatPage;
