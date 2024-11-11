import { getPartyMember } from '@/utils/memberCheck';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React from 'react';

const WarmingMemberList = ({ partyId }: { partyId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['partyMember', partyId],
    queryFn: async () => await getPartyMember(partyId)
  });
  if (isLoading) <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-10">
      {data ? (
        data.map((member) => {
          return (
            <div key={member.profile_id}>
              <p>{member.nickname}</p>
              <Image src={member.profile_image} alt={member.nickname} />
              <button>식빵 데우기</button>
            </div>
          );
        })
      ) : (
        <p>데이터를 불러오지 못했습니다. </p>
      )}
    </div>
  );
};

export default WarmingMemberList;
