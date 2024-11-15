'use client';
import { getPartyMember } from '@/utils/memberCheck';
import MemberProfileCard from './MemberProfile';
import { useQuery } from '@tanstack/react-query';
import InvitedButton from './InvitedButton';
import { partyInfo } from '@/types/partyInfo';
import ExitButton from './ExitButton';

const MemberList = ({
  partyData,
  userId,
  end,
  partyOwner
}: {
  partyData: partyInfo;
  userId: string | null | undefined;
  end: boolean;
  partyOwner: string;
}) => {
  // 파티 멤버 정보들을 불러오기
  const { data, isLoading } = useQuery({
    queryKey: ['partyMember', partyData.party_id],
    queryFn: async () => await getPartyMember(partyData.party_id)
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const isMember = data?.some((n) => n.user_id === userId);

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
          {userId && isMember && !end ? (
            <InvitedButton partyNumber={partyData.party_id} userId={userId} situation={partyData.situation} />
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col items-start gap-4 text-static-black body-s">
          {data && data.length > 0 ? (
            data
              .filter((n) => n.user_id === partyData.owner_id)
              .concat(data.filter((n) => n.user_id !== partyData.owner_id))
              .map((mem) => {
                return <MemberProfileCard key={mem.profile_id} memberInfo={mem} ownerId={partyData.owner_id} />;
              })
          ) : (
            <>
              <p>멤버가 없습니다</p>
            </>
          )}
        </div>
        {userId && isMember && !end && !(partyOwner === userId) ? (
          <ExitButton partyId={partyData.party_id} userId={userId} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MemberList;
