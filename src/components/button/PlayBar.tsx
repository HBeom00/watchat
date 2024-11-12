'use client';

import { useState } from 'react';

const PlayBar = ({ startTime, duration }: { startTime: string; duration: number }) => {
  const startPlayTime = startTime;

  const movie_hour = duration / 60;
  const movie_second = duration % 60;

  const playEnd = [Math.floor(movie_hour), movie_second < 10 ? `0${movie_second}` : movie_second];

  const [playTime, setPlayTime] = useState<number>(0);

  if (duration * 60 > playTime) {
    setTimeout(() => setPlayTime(getPlayTime(startPlayTime)), 1000);
  }
  return (
    <div className="pt-2 pb-4 px-4 flex flex-col items-start gap-2 self-stretch bg-white">
      <div className="flex justify-between items-center self-stretch">
        {playTime > 0 && duration * 60 > playTime ? (
          <p className="label-m text-Grey-700">{nowTimeDisplay(playTime)}</p>
        ) : (
          <p className="label-m text-Grey-700">00:00:00</p>
        )}
        <p className="label-m text-Grey-700">{`${playEnd[0]}:${playEnd[1]}:00`}</p>
      </div>
      <input
        type="range"
        min={0}
        max={duration * 60}
        step={1}
        value={playTime}
        onChange={() => {}}
        className="custom-scrollbar w-full h-1 flex flex-col gap-2 self-stretch bg-Grey-200"
      />
    </div>
  );
};

export default PlayBar;

const getPlayTime = (startTime: string) => {
  // 시작 시각
  const startTimeArr = startTime.split('.')[0].split('T')[1].split(':').map(Number);
  const startPlayTime = startTimeArr[0] * 60 * 60 + startTimeArr[1] * 60 + startTimeArr[2];

  // 현재 시각
  const myTime = new Date();
  myTime.setHours(myTime.getHours() + 9);
  const localTime = myTime.toISOString();
  const localTimeArr = localTime.split('.')[0].split('T')[1].split(':').map(Number);

  let nowTime = localTimeArr[0] * 60 * 60 + localTimeArr[1] * 60 + localTimeArr[2];

  // 영상을 보다가 자정00:00이 넘는 경우를 생각함
  // 8시 이전 로직
  if (nowTime < 8 * 60 * 60 && !(startPlayTime < 8 * 60 * 60)) {
    nowTime += 24 * 60 * 60;
  }

  return nowTime - startPlayTime;
};

// 현재 영상진도
const nowTimeDisplay = (playTime: number) => {
  const movie_now_hour = playTime / 60 / 60;
  const movie_now_minute = playTime / 60;
  const movie_now_second = playTime % 60;

  const hours = Math.floor(movie_now_hour) < 10 ? `0${Math.floor(movie_now_hour)}` : String(Math.floor(movie_now_hour));
  const minutes =
    Math.floor(movie_now_minute) - Math.floor(movie_now_hour) * 60 < 10
      ? `0${Math.floor(movie_now_minute) - Math.floor(movie_now_hour) * 60}`
      : String(Math.floor(movie_now_minute) - Math.floor(movie_now_hour) * 60);
  const seconds = movie_now_second < 10 ? `0${movie_now_second}` : String(movie_now_second);
  return `${hours}:${minutes}:${seconds}`;
};
