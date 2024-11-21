export const startTimeString = (startTime: string | null) => {
  const date =
    startTime &&
    startTime
      .split('.')[0]
      .split('T')[0]
      .split('-')
      .slice(1, 3)
      .map((d, i) => (i === 0 ? `${d}월 ` : `${d}일 `))
      .join('');
  const time = startTime && startTime.split('.')[0].split('T')[1].split(':').slice(0, 2).join(':');
  const startString = date && time ? date + time + ' 시작' : 0 + ' 시작';

  return startString;
};
