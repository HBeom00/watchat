import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
type Props = {
  score: number;
  scoreMessage: string;
  selectScore: number;
  setScore: Dispatch<SetStateAction<number>>;
  setCommentArr: Dispatch<SetStateAction<string[]>>;
  image_src: string[];
};

const ScoreCard = ({ score, scoreMessage, image_src, setScore, setCommentArr, selectScore }: Props) => {
  const onSelect = selectScore === score;
  return (
    <div
      className="flex flex-col px-[8px] justify-center items-center"
      onClick={() => {
        setScore(score);
        setCommentArr([]);
      }}
    >
      <div className="flex p-[4.8px] items-start">
        <Image
          src={`/scoreImage/${onSelect ? image_src[1] : image_src[0]}.svg`}
          width={44}
          height={38}
          alt={scoreMessage}
        />
      </div>
      <p className={`${onSelect ? 'text-primary-400' : 'text-Grey-300'} text-center body-l-bold`}>{scoreMessage}</p>
    </div>
  );
};

export default ScoreCard;
