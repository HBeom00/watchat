import WarmingMemberList from '../(components)/WarmingMemberList';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex flex-col">
      <title>식빵을 데워주세요</title>
      <WarmingMemberList partyId={params.id} />
    </div>
  );
};

export default page;
