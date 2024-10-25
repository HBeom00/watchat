'use client';

import { useState } from 'react';

const PlayBar = () => {
  // supabase에서 가져와야한다
  // 분
  const startTime = '23:59';
  const startPlayTime = Number(startTime.split(':')[0]) * 60 + Number(startTime.split(':')[1]);

  //supabase에서 가져와야한다
  // 분
  const duration = 400;
  const playEnd = [Math.floor(duration / 60), duration % 60 < 10 ? `0${duration % 60}` : duration % 60];

  // 플레이타임
  // 초
  const [playTime, setPlayTime] = useState<number>(getPlayTime(startPlayTime));

  const timer = setTimeout(() => setPlayTime(getPlayTime(startPlayTime)), 1000);
  if (!(duration * 60 > playTime)) {
    clearTimeout(timer);
  }

  return (
    <div>
      <p>영상 시청 진도 바</p>
      <div className="flex flex-row gap-6">
        <p>00:00:00</p>
        <input type="range" min={0} max={duration * 60} step={1} value={playTime} onChange={() => {}} />
        <p>{`${playEnd[0]}:${playEnd[1]}:00`}</p>
      </div>
    </div>
  );
};

export default PlayBar;

const getPlayTime = (startPlayTime: number) => {
  // 현재 시각
  const nowTimeArr = [new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()];
  let nowTime = nowTimeArr[0] * 60 * 60 + nowTimeArr[1] * 60 + nowTimeArr[2];

  // 영상을 보다가 자정00:00이 넘는 경우를 생각함
  // 8시 이전 로직
  if (nowTime < 8 * 60 * 60 && !(startPlayTime * 60 < 8 * 60 * 60)) {
    nowTime += 24 * 60 * 60;
  }

  return nowTime - startPlayTime * 60;
};
