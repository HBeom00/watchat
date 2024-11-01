export const formatDateTime = (getDate: string, getTime: string) => {
  // 입력값 검증
  if (!getDate || !getTime) {
    console.error('유효하지 않은 날짜 또는 시간:', { getDate, getTime });
    return { formattedDate: '', formattedTime: '' }; // 기본값 반환
  }
  const date = new Date(`${getDate}T${getTime}`);

  // Date 객체 생성 확인
  if (isNaN(date.getTime())) {
    throw new Error('유효하지 않은 날짜 형식');
  }

  const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월
  const day = ('0' + date.getDate()).slice(-2); // 일
  const hours = ('0' + date.getHours()).slice(-2); // 시
  const minutes = ('0' + date.getMinutes()).slice(-2); // 분

  const formattedDate = `${month}월 ${day}일`;
  const formattedTime = `${hours}:${minutes}`;

  return { formattedDate, formattedTime };
};
