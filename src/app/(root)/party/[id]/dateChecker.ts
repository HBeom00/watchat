// 오늘이 시청날짜일 때
export const nowWatchingDate = (watch_date: string, start_time: string, duration: number): boolean => {
  // 시작시간
  const watchDate = watch_date.split('-').map(Number);
  const extract = start_time.split('.')[0];
  const startTime = extract.split(':').map(Number);

  console.log([...watchDate, ...startTime]);
  console.log(
    new Date(watchDate[0], watchDate[1], watchDate[2], startTime[0], startTime[1], startTime[2]).toLocaleString(
      'en-US',
      { timeZone: 'Asia/Seoul' }
    )
  );

  // 종료시간

  // 현재시간
  const nowDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Seoul' }).split('/').map(Number);
  const nowDateArr = [nowDate[2], nowDate[0], nowDate[1]];

  let today = true;
  for (let i = 0; i < 3; i++) {
    if (i === 2 && watchDate[i] === nowDateArr[i] - 1) {
      today = true;
      break;
    }
    if (watchDate && watchDate[i] !== nowDateArr[i]) {
      today = false;
      break;
    }
  }
  console.log(watch_date, today, duration);
  return today;
};
