import PlayBar from '@/components/button/PlayBar';
import Chat from '@/components/chat/Chat';
import { createClient } from '@/utils/supabase/server';

const page = async ({ params }: { params: { id: string } }) => {
  const roomId = params.id;
  const { data, error } = await createClient().from('party_info').select().eq('party_id', roomId);

  if (error) {
    console.error('Error fetching party info:', error);
    return <div>Error loading party info.</div>;
  }

  return (
    <div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
      <PlayBar startTime={data?.[0].start_time} duration={data?.[0].duration_time} />
      <Chat roomId={roomId} />
    </div>
  );
};

export default page;
