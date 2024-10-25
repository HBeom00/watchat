'use client';

import { inviteHandler } from '@/utils/invite';
import { member } from './MemberList';
import { memberExpulsion } from '@/utils/ownerRights';

const MemberProfileCard = ({
  partyNumber,
  memberInfo,
  isMember,
  userId,
  isOwner
}: {
  partyNumber: string;
  memberInfo: member;
  isMember: boolean;
  userId: string | null;
  isOwner: boolean;
}) => {
  // 내 정보에서는 초대하기와 팔로우 불필요함
  const myInfo = memberInfo.user_id === userId;
  return (
    <div>
      <div>
        <p>닉네임:{memberInfo.nickname}</p>
        <p>프로필이미지:{memberInfo.profile_image}</p>
        {isMember && !myInfo && !isOwner ? (
          <>
            <button onClick={() => inviteHandler(partyNumber, memberInfo.user_id)} className="bg-blue-400 p-4">
              초대하기
            </button>
            <button className="bg-blue-400 p-4">팔로우버튼</button>
          </>
        ) : (
          <></>
        )}
        {isOwner ? (
          <button onClick={() => memberExpulsion(memberInfo.profile_id, partyNumber)}>강퇴하기</button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MemberProfileCard;
