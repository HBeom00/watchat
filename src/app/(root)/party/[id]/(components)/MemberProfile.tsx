'use client';

import { member } from '@/types/partyMember';
import Image from 'next/image';

const MemberProfileCard = ({
  memberInfo,

  ownerId
}: {
  memberInfo: member;

  ownerId: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={memberInfo.profile_image}
        width={40}
        height={40}
        style={{
          objectFit: 'cover',
          width: '40px',
          height: '40px',
          borderRadius: '50%'
        }}
        alt="프로필이미지"
      />
      <div className="flex items-center gap-1">
        <p>{memberInfo.nickname}</p>
        {ownerId === memberInfo.user_id ? <Image src={'/owner_icon.svg'} width={18} height={18} alt="오너" /> : <></>}
      </div>
    </div>
  );
};

export default MemberProfileCard;
