'use client';

import { follow } from '@/store/followUnfollow';
import { member } from '@/utils/memberCheck';
import Image from 'next/image';

const MemberProfileCard = ({
  isMember,
  memberInfo,
  userId,
  ownerId
}: {
  isMember: boolean | null | undefined;
  memberInfo: member;
  userId: string | null;
  ownerId: string;
}) => {
  // 내 정보에서는 팔로우 불필요함
  const myInfo = memberInfo.user_id === userId;

  return (
    <div>
      <div>
        <Image src={memberInfo.profile_image} width={100} height={100} alt="프로필이미지" />
        <p>닉네임:{memberInfo.nickname}</p>
        {ownerId === userId ? <p>얘가 오너</p> : <></>}
        {userId && isMember && !myInfo ? (
          <button onClick={() => follow(userId, memberInfo.user_id)} className="bg-blue-400 p-4">
            팔로우버튼
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MemberProfileCard;
