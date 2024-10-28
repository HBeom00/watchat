import { partyInfo } from '@/types/partyInfo';

// 오늘이 시청날짜일 때
export const nowWatchingDate = (partyData: partyInfo): boolean => {
  const watchDate = partyData.watch_date?.split('-');
  const nowDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Seoul' }).split('/');
  const nowDateArr = [nowDate[2], nowDate[0], nowDate[1]];
  let today = true;
  for (let i = 0; i < 3; i++) {
    if (watchDate && watchDate[i] !== nowDateArr[i]) {
      today = false;
      break;
    }
  }
  return today;
};
