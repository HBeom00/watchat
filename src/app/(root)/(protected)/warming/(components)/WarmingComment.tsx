import browserClient from '@/utils/supabase/client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import SubmitDialog from './SubmitDialog';

type Props = {
  memberSelect: number;
  setMemberSelect: Dispatch<SetStateAction<number>>;
  userId: string;
  partyId: string;
  memberLength: number;
  memberId: string;
};
const WarmingComment = ({ memberSelect, userId, partyId, setMemberSelect, memberLength, memberId }: Props) => {
  const [score, setScore] = useState<number>(0);
  const [commentArr, setCommentArr] = useState<string[]>([]);

  useEffect(() => {
    setScore(0);
    setCommentArr([]);
  }, [memberSelect]);

  const submitWarmingHandler = async () => {
    const { error } = await browserClient.from('warming').upsert(
      {
        warming_id: `${userId}/${memberId}/${partyId}`,
        warmer_id: userId,
        warming_user_id: memberId,
        party_id: partyId,
        temperature: score,
        comment: commentArr
      },
      { onConflict: 'warming_id' }
    );
    if (error) {
      console.log('평가에 실패했습니다.');
      return;
    }
    if (memberSelect < memberLength - 1) {
      setMemberSelect((current) => current + 1);
    }
  };
  return (
    <div className="flex flex-col gap-10">
      <p>함께 시청한 멤버의 후기를 남겨보세요.</p>
      <div className="flex flex-row gap-10">
        <p
          onClick={() => {
            setScore(-1);
            setCommentArr([]);
          }}
        >
          노쇼
        </p>
        <p
          onClick={() => {
            setScore(-2);
            setCommentArr([]);
          }}
        >
          나쁨
        </p>
        <p
          onClick={() => {
            setScore(1);
            setCommentArr([]);
          }}
        >
          굿
        </p>
        <p
          onClick={() => {
            setScore(2);
            setCommentArr([]);
          }}
        >
          그뤠잇
        </p>
      </div>
      <div>
        {getCommentArr(score).length > 0 ? (
          getCommentArr(score).map((comment) => {
            return (
              <div key={comment}>
                <p
                  className={commentArr.some((n) => comment === n) ? 'text-primary-500' : ''}
                  onClick={() => setCommentArr((current) => [...current, comment])}
                >
                  {comment}
                </p>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
      <button onClick={() => submitWarmingHandler()}>{memberSelect === memberLength - 1 ? '완료' : '다음'}</button>
      <SubmitDialog />
    </div>
  );
};

export default WarmingComment;

const greatCommentArr = ['매너있게 관람했어요.', '시간 약속을 잘 지켜요.', '다음에 같이 시청하고 싶어요.'];
const goodCommentArr = ['시청 매너가 좋아요.', '시간 약속을 잘 지켜요.', '즐겁게 관람했어요.'];
const badCommentArr = ['시청 매너가 아쉬웠어요.', '시간 약속을 지키지 않아요.', '다음에 함께하고 싶지 않아요.'];
const noShowCommentArr = ['참여하지 않았어요.', '중간에 나가서 돌아오지 않았어요.'];

const getCommentArr = (score: number) => {
  if (score === 2) return greatCommentArr;
  if (score === 1) return goodCommentArr;
  if (score === -2) return badCommentArr;
  if (score === -1) return noShowCommentArr;
  return [];
};
