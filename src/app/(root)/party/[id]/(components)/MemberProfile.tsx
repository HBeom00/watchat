'use client';

import { inviteHandler } from '@/utils/invite';

const MemberProfileCard = ({
  partyNumber,
  memberNumber,
  isMember
}: {
  partyNumber: string;
  memberNumber: string;
  isMember: boolean;
}) => {
  return (
    <div>
      <div>
        <p>멤버 파티 닉네임</p>
        <p>멤버 파티 프로필이미지</p>
        {isMember ? (
          <>
            <button onClick={() => inviteHandler(partyNumber, memberNumber)} className="bg-blue-400 p-6">
              초대하기
            </button>
            <button>팔로우버튼</button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MemberProfileCard;
