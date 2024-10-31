// 영상 시청 상태
// (watch_date랑 start_time이 아직 지나지 않았을 때: "모집중")
// (watch_date랑 start_time이 지났는데 duration_time만큼 시간이 지나지 않았을 때 : "시청중")
// (watch_date랑 start_time에서 duration_time도 지났을 때: "시청완료")

type Party = {
  watch_date: string;
  start_time: string;
  duration_time: number;
};

export const getViewStatus = (party: Party) => {
  const currentDate = new Date();
  const watchDate = new Date(party.watch_date);
  const startTime = new Date(party.start_time);
  const durationTime = party.duration_time;
  const endTime = new Date(startTime.getTime() + durationTime * 60 * 1000);

  if (currentDate < watchDate || currentDate < startTime) {
    return '모집중';
  } else if (currentDate >= startTime && currentDate < endTime) {
    return '시청중';
  } else {
    return '시청완료';
  }
};
