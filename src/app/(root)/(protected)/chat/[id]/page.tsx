import PlayBar from '@/components/button/PlayBar';
import Chat from '@/components/chat/Chat';
import SidebarToggle from '@/components/chat/SidebarToggle';
import { createClient } from '@/utils/supabase/server';

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const roomId = params.id;
  // start_time 불러오기 11.01
  const { data, error } = await createClient().from('party_info').select().eq('party_id', roomId);

  if (error) {
    console.error('Error fetching party info:', error);
    return <div>Error loading party info.</div>;
  }

  return (
    <div className="flex relative">
      <div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
        <div className="flex justify-between items-center px-2">
          <div>
            <p>{data?.[0].party_name}</p>
            <p>{data?.[0].video_name}</p>
          </div>
          <SidebarToggle roomId={roomId} />
        </div>
        <PlayBar startTime={data?.[0].start_time} duration={data?.[0].duration_time} />
        <Chat roomId={roomId} />
      </div>
    </div>
  );
};

export default ChatPage;
