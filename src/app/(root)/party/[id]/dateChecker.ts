// 오늘이 시청날짜일 때
export const nowWatchingDate = (watch_date: string): boolean => {
  const watchDate = watch_date?.split('-');
  const nowDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Seoul' }).split('/');
  const nowDateArr = [nowDate[2], nowDate[0], nowDate[1]];
  let today = true;
  for (let i = 0; i < 3; i++) {
    if (i === 2 && watchDate && Number(watchDate[i]) === Number(nowDateArr[i]) - 1) {
      today = true;
      break;
    }
    if (watchDate && watchDate[i] !== nowDateArr[i]) {
      today = false;
      break;
    }
  }
  console.log(watch_date, today);
  return today;
};

// 시청 전 / 시청 중 / 시청 후
