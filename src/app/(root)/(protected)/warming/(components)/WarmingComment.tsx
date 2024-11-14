import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { submit } from './WarmingMemberList';
import ScoreCard from './ScoreCard';

type Props = {
  memberSelect: number;
  userId: string;
  partyId: string;
  memberId: string;
  submitArr: submit[];
  setSubmitArr: Dispatch<SetStateAction<submit[]>>;
};

const WarmingComment = ({ memberSelect, userId, partyId, memberId, submitArr, setSubmitArr }: Props) => {
  const thisSubmitData = submitArr.filter((n) => n.warming_user_id === memberId)[0];
  const [score, setScore] = useState<number>(thisSubmitData.temperature);
  const [commentArr, setCommentArr] = useState<string[]>(thisSubmitData.comment);

  useEffect(() => {
    setScore(thisSubmitData.temperature);
    setCommentArr(thisSubmitData.comment);
  }, [memberSelect]);

  return (
    <>
      <div className="flex flex-row py-[8px] justify-between items-center self-stretch">
        {scoreArr.map((n) => {
          return (
            <ScoreCard
              key={n.scoreMessage}
              score={n.score}
              scoreMessage={n.scoreMessage}
              image_src={n.image_src}
              selectScore={score}
              setScore={setScore}
              setCommentArr={setCommentArr}
            />
          );
        })}
      </div>
      <div>
        {getCommentArr(score).length > 0 ? (
          getCommentArr(score).map((comment) => {
            return (
              <div key={comment}>
                <p
                  className={commentArr.some((n) => comment === n) ? 'text-primary-500' : ''}
                  onClick={() => {
                    setCommentArr((current) => [...current, comment]);
                    setSubmitArr((current) => {
                      const data = current.map((n) => {
                        if (n.warming_user_id === memberId) {
                          return {
                            warmer_id: userId,
                            warming_user_id: memberId,
                            party_id: partyId,
                            temperature: score,
                            comment: [...commentArr, comment]
                          };
                        }
                        return n;
                      });

                      return data;
                    });
                  }}
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
    </>
  );
};

export default WarmingComment;

const scoreArr: {
  score: number;
  scoreMessage: string;
  image_src: string[];
}[] = [
  { score: -1, scoreMessage: 'No Show', image_src: ['noShowCat', 'noShowCat_select'] },
  { score: -2, scoreMessage: 'Bad', image_src: ['badCat', 'badCat_select'] },
  { score: 1, scoreMessage: 'Good', image_src: ['goodCat', 'goodCat_select'] },
  { score: 2, scoreMessage: 'Great!', image_src: ['greatCat', 'greatCat_select'] }
];

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
