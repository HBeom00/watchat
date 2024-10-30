'use client';
import { getPartyMember } from '@/utils/memberCheck';
import MemberProfileCard from './MemberProfile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memberExpulsion } from '@/utils/ownerRights';

const MemberList = ({
  partyNumber,
  userId,
  isMember,
  end,
  partyOwner
}: {
  partyNumber: string;
  userId: string | null;
  isMember: boolean | null | undefined;
  end: boolean;
  partyOwner: string;
}) => {
  const queryClient = useQueryClient();

  // 파티 멤버 정보들을 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['partyMember', partyNumber],
    queryFn: async () => await getPartyMember(partyNumber)
  });

  // 파티 탈퇴하기
  const mutation = useMutation({
    mutationFn: (userId: string) => memberExpulsion(partyNumber, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partyMember', partyNumber] });
      queryClient.invalidateQueries({ queryKey: ['isMember', partyNumber, userId] });

      // 채팅하기 버튼이 안 바뀌는데.... 깜빡이게 할까
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>팀원 정보</p>
      {data && data.length > 0 ? (
        data.map((mem) => {
          return <MemberProfileCard key={mem.profile_id} isMember={isMember} memberInfo={mem} userId={userId} />;
        })
      ) : (
        <>
          <p>멤버가 없습니다</p>
        </>
      )}
      {userId && isMember && !end && !(partyOwner === userId) ? (
        <button onClick={() => mutation.mutate(userId)}>참가 취소하기</button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MemberList;
