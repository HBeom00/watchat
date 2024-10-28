'use client';
import { getPartyMember } from '@/utils/memberCheck';
import MemberProfileCard from './MemberProfile';
import { useQuery } from '@tanstack/react-query';

const MemberList = ({
  partyNumber,
  userId,
  isOwner
}: {
  partyNumber: string;
  userId: string | null;
  isOwner: boolean;
}) => {
  // 파티 멤버 정보들을 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['partyMember', partyNumber],
    queryFn: async () => await getPartyMember(partyNumber)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>팀원 정보</p>
      {data && data.length > 0 ? (
        data.map((mem) => {
          return (
            <MemberProfileCard
              key={mem.profile_id}
              partyNumber={partyNumber}
              memberInfo={mem}
              userId={userId}
              isOwner={isOwner}
            />
          );
        })
      ) : (
        <>
          <p>멤버가 없습니다</p>
        </>
      )}
    </div>
  );
};

export default MemberList;
