'use client';
import { member } from '@/types/partyMember';
import { useEffect, useState } from 'react';
import WarmingComment from './WarmingComment';
import SubmitDialog from './SubmitDialog';
import WarmingMemberCardList from './WarmingMemberCardList';
import { useRouter } from 'next/navigation';

export type submit = {
  warmer_id: string;
  warming_user_id: string;
  party_id: string;
  temperature: number;
  comment: string[];
};

const WarmingMemberList = ({
  userId,
  partyId,
  ownerId,
  memberData,
  isComplete
}: {
  partyId: string;
  userId: string;
  ownerId: string | undefined;
  memberData: member[];
  isComplete: boolean;
}) => {
  const router = useRouter();

  const initialArr: submit[] = Array.from({ length: memberData.length }).map((n, i) => {
    return {
      warmer_id: userId,
      warming_user_id: memberData[i].user_id,
      party_id: partyId,
      temperature: 0,
      comment: []
    };
  });
  const [submitArr, setSubmitArr] = useState<submit[]>(initialArr);

  const [memberSelect, setMemberSelect] = useState<number>(0);

  const done = submitArr[memberSelect].comment.length > 0;

  useEffect(() => {
    if (isComplete) {
      alert('이미 해당 파티의 후기를 작성하셨습니다.');
      router.replace('/');
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-start gap-[8px]">
      <div className="flex flex-col items-start gap-[16px] self-stretch">
        <div className="flex w-full border-solid border-Grey-200 border-b-[1px] items-center self-stretch">
          <WarmingMemberCardList
            memberData={memberData}
            memberSelect={memberSelect}
            setMemberSelect={setMemberSelect}
            ownerId={ownerId}
          />
        </div>
        <p className="text-center w-full text-Grey-600 body-xs">함께 시청한 멤버의 후기를 남겨보세요.</p>
      </div>
      {memberSelect < memberData.length ? (
        <WarmingComment
          memberSelect={memberSelect}
          userId={userId}
          partyId={partyId}
          memberId={memberData[memberSelect].user_id}
          submitArr={submitArr}
          setSubmitArr={setSubmitArr}
        />
      ) : (
        <></>
      )}
      <div className="mt-[32px] flex flex-col gap-[16px] w-full items-start">
        <button
          className={`rounded-[8px] w-full ${done ? 'outline-btn-xl ' : 'outline-disabled-btn-xl'}`}
          disabled={!done || memberSelect === memberData.length - 1}
          onClick={() => setMemberSelect((current) => current + 1)}
        >
          {memberSelect === memberData.length - 1 ? '완료' : '다음'}
        </button>
        <SubmitDialog submitArr={submitArr} userId={userId} party_id={partyId} />
      </div>
    </div>
  );
};

export default WarmingMemberList;
