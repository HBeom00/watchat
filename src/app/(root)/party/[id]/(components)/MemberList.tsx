'use client';
import { getPartyMember } from '@/utils/memberCheck';
import MemberProfileCard from './MemberProfile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import browserClient from '@/utils/supabase/client';

const MemberList = ({
  partyNumber,
  userId,
  isMember
}: {
  partyNumber: string;
  userId: string | null;
  isMember: boolean | null | undefined;
}) => {
  const queryClient = useQueryClient();

  // 파티 멤버 정보들을 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['partyMember', partyNumber],
    queryFn: async () => await getPartyMember(partyNumber)
  });

  // 파티 탈퇴하기
  const mutation = useMutation({
    mutationFn: (userId: string) => homecoming(partyNumber, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partyMember', partyNumber] });
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
      {userId && isMember ? <button onClick={() => mutation.mutate(userId)}>참가 취소하기</button> : <></>}
    </div>
  );
};

export default MemberList;

// 나가기
export const homecoming = async (partyNumber: string, userId: string) => {
  const { error } = await browserClient
    .from('team_user_profile')
    .delete()
    .eq('party_id', partyNumber)
    .eq('user_id', userId);
  if (error) {
    console.log(error.message);
  }
};
