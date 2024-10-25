import MemberList from './MemberList';

const Owner = ({ partyNumber, userId, isOwner }: { partyNumber: string; userId: string | null; isOwner: boolean }) => {
  return (
    <div>
      <p>오너 구역</p>
      <MemberList partyNumber={partyNumber} userId={userId} isOwner={isOwner} />
    </div>
  );
};

export default Owner;
