'use client';

import { member } from '@/utils/memberCheck';
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
        {ownerId === memberInfo.user_id ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <mask id="mask0_828_2472" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
              <rect width="20" height="20" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_828_2472)">
              <path
                d="M7.56217 13.5418L9.99967 12.0627L12.4372 13.5418L11.7913 10.771L13.958 8.896L11.1038 8.66683L9.99967 6.04183L8.89551 8.66683L6.04134 8.896L8.20801 10.771L7.56217 13.5418ZM9.99967 19.4168L7.20801 16.6668H3.33301V12.7918L0.583008 10.0002L3.33301 7.2085V3.3335H7.20801L9.99967 0.583496L12.7913 3.3335H16.6663V7.2085L19.4163 10.0002L16.6663 12.7918V16.6668H12.7913L9.99967 19.4168Z"
                fill="#7F4AF4"
              />
            </g>
          </svg>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MemberProfileCard;
