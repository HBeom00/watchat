'use client';
import { partyEnd } from '@/utils/ownerRights';
import MemberList from './MemberList';

const Owner = ({ partyNumber, userId, isOwner }: { partyNumber: string; userId: string | null; isOwner: boolean }) => {
  return (
    <div>
      <MemberList partyNumber={partyNumber} userId={userId} isOwner={isOwner} />
      <button onClick={async () => await partyEnd(partyNumber)}>파티 종료!</button>
    </div>
  );
};

export default Owner;
