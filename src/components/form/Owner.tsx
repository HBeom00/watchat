'use client';
import { getPartyMember } from '@/utils/memberCheck';
import { memberExpulsion, partyEnd } from '@/utils/ownerRights';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const Owner = ({ partyNumber, partyOwner }: { partyNumber: string; partyOwner: string }) => {
  const router = useRouter();
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
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>오너 권한</p>
      {data && data.length > 0 ? (
        data.map((mem) => {
          return (
            <div key={mem.profile_id} className="flex flex-row gap-9">
              <p>{mem.nickname}</p>
              {partyOwner === mem.user_id ? (
                <></>
              ) : (
                <button onClick={() => mutation.mutate(mem.user_id)}>강퇴하기</button>
              )}
            </div>
          );
        })
      ) : (
        <>
          <p>멤버가 없습니다</p>
        </>
      )}
      <button
        onClick={async () => {
          const success = await partyEnd(partyNumber);
          if (success) {
            router.replace('/');
          }
        }}
      >
        파티 종료!
      </button>
    </div>
  );
};

export default Owner;
