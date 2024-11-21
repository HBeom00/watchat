// 영상 시청 상태
// (watch_date랑 start_time이 아직 지나지 않았을 때: "모집중")
// (watch_date랑 start_time이 지났는데 duration_time만큼 시간이 지나지 않았을 때 : "시청중")
// (watch_date랑 start_time에서 duration_time도 지났을 때: "시청완료")

export type Party = {
  watch_date: string;
  start_time: string;
  duration_time: number;
};
// start_time이슈
export const getViewStatus = (party: Party) => {
  const currentDate = new Date();
  const watchDate = new Date(party.watch_date + 'T' + party.start_time.split('.')[0]);
  const endDate = new Date(party.watch_date + 'T' + party.start_time.split('.')[0]);
  endDate.setMinutes(endDate.getMinutes() + party.duration_time);

  if (currentDate < watchDate) {
    return '모집중';
  } else if (currentDate > watchDate && currentDate < endDate) {
    return '시청중';
  } else if (currentDate > endDate) {
    return '시청완료';
  }
  return '시청완료';
};

// const startTime = new Date(party.start_time.split('.')[0]);
// const durationTime = party.duration_time;
// const endTime = new Date(startTime.getTime() + durationTime * 60 * 1000);
