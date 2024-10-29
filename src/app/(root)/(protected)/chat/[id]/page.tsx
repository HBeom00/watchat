import Chat from '@/components/chat/Chat';

const page = ({ params }: { params: { id: string } }) => {
  const roomId = params.id;
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>실시간 채팅</h1>
      <Chat roomId={roomId} />
    </div>
  );
};

export default page;
