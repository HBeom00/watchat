'use client';

import { member } from '@/utils/memberCheck';
import Image from 'next/image';

const MemberProfileCard = ({
  isMember,
  memberInfo,
  userId
}: {
  isMember: boolean | null | undefined;
  memberInfo: member;
  userId: string | null;
}) => {
  // 내 정보에서는 팔로우 불필요함
  const myInfo = memberInfo.user_id === userId;

  return (
    <div>
      <div>
        <p>닉네임:{memberInfo.nickname}</p>
        <Image src={memberInfo.profile_image} width={100} height={100} alt="프로필이미지" />
        {isMember && !myInfo ? <button className="bg-blue-400 p-4">팔로우버튼</button> : <></>}
      </div>
    </div>
  );
};

export default MemberProfileCard;
