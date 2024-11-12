'use client';
import { member } from '@/types/partyMember';
import Image from 'next/image';
import { useState } from 'react';
import WarmingComment from './WarmingComment';

const WarmingMemberList = ({
  userId,
  partyId,
  memberData
}: {
  partyId: string;
  userId: string;
  memberData: member[];
}) => {
  const [memberSelect, setMemberSelect] = useState<number>(0);

  return (
    <div>
      <div className="flex flex-row gap-10">
        {memberData ? (
          memberData
            .filter((n) => n.user_id !== userId)
            .map((member, i) => {
              return (
                <div
                  key={member.profile_id}
                  onClick={() => setMemberSelect(i)}
                  className={memberSelect === i ? 'border-solid border-primary-500 border-b-2' : ''}
                >
                  <Image src={member.profile_image} width={50} height={50} alt={member.nickname} />
                  <p>{member.nickname}</p>
                </div>
              );
            })
        ) : (
          <p>데이터를 불러오지 못했습니다. </p>
        )}
      </div>
      {memberSelect < memberData.length ? (
        <WarmingComment
          memberSelect={memberSelect}
          setMemberSelect={setMemberSelect}
          memberLength={memberData.length}
          userId={userId}
          partyId={partyId}
          memberId={memberData[memberSelect].user_id}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default WarmingMemberList;
