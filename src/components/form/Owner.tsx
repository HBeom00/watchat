'use client';
import { homecoming } from '@/app/(root)/party/[id]/(components)/MemberList';
import { getPartyMember } from '@/utils/memberCheck';
import { partyEnd } from '@/utils/ownerRights';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Owner = ({ partyNumber }: { partyNumber: string }) => {
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
          return (
            <div key={mem.profile_id} className="flex flex-row gap-9">
              <p>{mem.nickname}</p>
              <button onClick={() => mutation.mutate(mem.user_id)}>강퇴하기</button>
            </div>
          );
        })
      ) : (
        <>
          <p>멤버가 없습니다</p>
        </>
      )}
      <button onClick={() => partyEnd(partyNumber)}>파티 종료!</button>
    </div>
  );
};

export default Owner;
