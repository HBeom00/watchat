import { partyInfo } from '@/types/partyInfo';

export const chatOpenClose = (party: partyInfo) => {
  const currentDate = new Date();
  const watchDate = new Date(party.watch_date + 'T' + party.start_time.split('.')[0]);
  const endDate = new Date(party.watch_date + 'T' + party.start_time.split('.')[0]);
  watchDate.setMinutes(watchDate.getMinutes() - 10);
  endDate.setMinutes(endDate.getMinutes() + party.duration_time + 10);

  if (currentDate < watchDate) {
    return '모집중';
  } else if (currentDate > watchDate && currentDate < endDate) {
    return '시청중';
  } else if (currentDate > endDate) {
    return '시청완료';
  }
};
