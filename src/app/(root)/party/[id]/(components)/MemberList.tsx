'use client';
import { getPartyMember } from '@/utils/memberCheck';
import MemberProfileCard from './MemberProfile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { memberExpulsion } from '@/utils/ownerRights';
import InvitedButton from './InvitedButton';
import { partyInfo } from '@/types/partyInfo';

const MemberList = ({
  partyData,
  userId,
  isMember,
  end,
  partyOwner
}: {
  partyData: partyInfo;
  userId: string | null;
  isMember: boolean | null | undefined;
  end: boolean;
  partyOwner: string;
}) => {
  const queryClient = useQueryClient();

  // 파티 멤버 정보들을 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['partyMember', partyData.party_id],
    queryFn: async () => await getPartyMember(partyData.party_id)
  });

  // 파티 탈퇴하기
  const mutation = useMutation({
    mutationFn: (userId: string) => memberExpulsion(partyData.party_id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partyMember', partyData.party_id] });
      queryClient.invalidateQueries({ queryKey: ['isMember', partyData.party_id, userId] });
      queryClient.invalidateQueries({ queryKey: ['myParty', userId] });
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>파티 소개</p>
      <p>{partyData.party_detail}</p>
      <p>참여 멤버</p>
      {/* 누르면 내가 팔로우한 유저들이 표시되고 그 중에서 초대할 수 있음 */}
      {userId && isMember ? <InvitedButton partyNumber={partyData.party_id} userId={userId} /> : <></>}
      <p>참여자 {data ? data.length : 0}명</p>
      {data && data.length > 0 ? (
        data.map((mem) => {
          return (
            <MemberProfileCard
              key={mem.profile_id}
              isMember={isMember}
              memberInfo={mem}
              userId={userId}
              ownerId={partyData.owner_id}
            />
          );
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
