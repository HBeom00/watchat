'use client';
import { getPartyMember } from '@/utils/memberCheck';
import MemberProfileCard from './MemberProfile';
import { useQuery } from '@tanstack/react-query';
import { partyInfo } from '@/types/partyInfo';
import ExitButton from './ExitButton';
import InvitedButton from './InvitedButton';
import Loading from '@/app/loading';

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
    return <Loading />;
  }
  const isMember = data?.some((n) => n.user_id === userId) || false;

  return (
    <div className="flex flex-col w-full gap-[32px] items-start">
      <div className={`flex flex-col w-full items-start gap-[8px] text-Grey-900`}>
        <p className="self-stretch body-l-bold">파티 소개</p>
        <div
          className={`flex py-[12px] px-[16px] w-[520px] items-center self-stretch rounded-[8px] bg-Grey-50
          mobile:w-full`}
        >
          <p>{partyData.party_detail}</p>
        </div>
      </div>
      <div
        className={`flex flex-col items-start gap-[16px]
        mobile:w-full`}
      >
        <div
          className={`flex flex-row justify-between items-center self-stretch w-[520px]
          mobile:w-full`}
        >
          <div className="flex flex-col items-start">
            <p className="text-Grey-900 body-l-bold">참여 멤버</p>
            <p className="text-Grey-600 label-l">참여자 {data ? data.length : 0}명</p>
          </div>
          {userId && isMember && !end ? (
            <InvitedButton partyNumber={partyData.party_id} userId={userId} situation={partyData.situation} />
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col items-start gap-[16px] text-Grey-900 body-s">
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
