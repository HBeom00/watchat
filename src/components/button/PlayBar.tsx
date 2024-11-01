'use client';

import { useState } from 'react';

const PlayBar = ({ startTime, duration }: { startTime: string; duration: number }) => {
  // supabase에서 가져와야한다
  // 시작 시간
  const startPlayTime = startTime;

  // duration을 가져와서
  // 끝나는 시간을 구함
  // 분
  const playEnd = [Math.floor(duration / 60), duration % 60 < 10 ? `0${duration % 60}` : duration % 60];

  // 플레이타임
  // 초
  const [playTime, setPlayTime] = useState<number>(getPlayTime(startPlayTime));

  if (duration * 60 > playTime) {
    setTimeout(() => setPlayTime(getPlayTime(startPlayTime)), 1000);
  }
  console.log(playTime, '확인값');
  return (
    <div>
      <p>영상 시청 진도 바</p>
      {/* 현재 진행 시간 */}
      <div className="flex flex-row gap-6">
        <p>{startTime.split('.')[0].split('T')[1]}</p>
        {playTime > 0 && duration * 60 > playTime ? <p>{nowTimeDisplay(playTime)}</p> : <p>00:00:00</p>}

        <input type="range" min={0} max={duration * 60} step={1} value={playTime} onChange={() => {}} />
        <p>{`${playEnd[0]}:${playEnd[1]}:00`}</p>
      </div>
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
  const hours =
    Math.floor(playTime / 60 / 60) < 10 ? `0${Math.floor(playTime / 60 / 60)}` : String(Math.floor(playTime / 60 / 60));
  const minutes =
    Math.floor(playTime / 60) - Math.floor(playTime / 60 / 60) * 60 < 10
      ? `0${Math.floor(playTime / 60) - Math.floor(playTime / 60 / 60) * 60}`
      : String(Math.floor(playTime / 60) - Math.floor(playTime / 60 / 60) * 60);
  const seconds = playTime % 60 < 10 ? `0${playTime % 60}` : String(playTime % 60);
  return `${hours}:${minutes}:${seconds}`;
};
