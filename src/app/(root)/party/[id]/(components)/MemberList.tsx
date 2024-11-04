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
    <div className="flex flex-col w-full gap-4 items-start">
      <div className="flex flex-col w-[519px] items-start gap-2 text-Grey-900">
        <p className="self-stretch body-l-bold">파티 소개</p>
        <div className="flex py-3 px-4 w-full items-center self-stretch rounded-lg bg-Grey-50">
          <p>{partyData.party_detail}</p>
        </div>
      </div>
      <div className="flex flex-col w-[520px] items-start gap-4 mb-[71px]">
        <div className="flex flex-row justify-between items-center self-stretch">
          <div className="flex flex-col items-start w-[257px]">
            <p className="text-Grey-900 body-l-bold">참여 멤버</p>
            <p className="text-Grey-600 label-l">참여자 {data ? data.length : 0}명</p>
          </div>
          {userId && isMember ? (
            <InvitedButton partyNumber={partyData.party_id} userId={userId}>
              <button className="flex w-[94px] py-[6px] px-3 justify-center items-center rounded-lg border-solid border-Grey-300 border-[1px] text-Grey-400 body-xs-bold">
                초대하기
              </button>
            </InvitedButton>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col items-start gap-4 text-static-black body-s">
          {data && data.length > 0 ? (
            data.map((mem) => {
              return <MemberProfileCard key={mem.profile_id} memberInfo={mem} ownerId={partyData.owner_id} />;
            })
          ) : (
            <>
              <p>멤버가 없습니다</p>
            </>
          )}
        </div>
        {userId && isMember && !end && !(partyOwner === userId) ? (
          <button
            className="inline-flex py-2 items-center my-[17.5px] text-Grey-400 body-xs-bold"
            onClick={() => mutation.mutate(userId)}
          >
            참여 취소
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MemberList;
