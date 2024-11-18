import PlayBar from '@/components/button/PlayBar';
import Chat from '@/components/chat/Chat';
import SidebarToggle from '@/components/chat/SidebarToggle';
import { createClient } from '@/utils/supabase/server';
import arrow_back from '../../../../../../public/arrow_left_2.svg';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Notify from '@/components/chat/Notify';

export const metadata: Metadata = {
  title: '라이브 채팅방',
  description: '파티 참여자와 실시간 소통할 수 있는 채팅방 입니다.'
};

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const roomId = params.id;

  const { data, error } = await createClient().from('party_info').select().eq('party_id', roomId);

  if (error) {
    console.error('Error fetching party info:', error);
    return <div>Error loading party info.</div>;
  }

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div
        className={`
        w-[700px] bg-Grey-50
        mobile:w-[375px]
        `}
      >
        {/* 뒤로가기, 프로그램 정보, 사이드바 */}
        <div className="flex pt-[16px] justify-between items-center self-stretch bg-white">
          <div className="flex items-center">
            <Link
              href={`/party/${roomId}`}
              className="w-[40px] p-[8px] flex justify-between items-center text-Grey-900"
            >
              <Image
                src={arrow_back}
                alt="back_img"
                width={24}
                height={24}
                className="w-[24px] h-[24px] flex shrink-0"
              />
            </Link>
            <div className="flex flex-col justify-center items-start">
              <p className="body-l-bold text-center text-Grey-900">{data?.[0].party_name}</p>
              <p className="label-m text-Grey-700">{data?.[0].video_name}</p>
            </div>
          </div>
          <SidebarToggle roomId={roomId} />
        </div>
        {/* 재생바 */}
        <PlayBar startTime={data?.[0].start_date_time} duration={data?.[0].duration_time} />
        {/* 공지사항 */}
        <Notify roomId={roomId} />
        {/* 채팅창 */}
        <Chat roomId={roomId} />
      </div>
    </div>
  );
};

export default ChatPage;
