export const transPlatform = (platform: string) => {
  if (platform === 'Netflix') return '넷플릭스';

  if (platform === 'Tving') return '티빙';
  if (platform === 'wavve') return '웨이브';
  if (platform === 'Disney Plus') return '디즈니플러스';
  if (platform === 'Coupang') return '쿠팡플레이';
  if (platform === 'Watcha') return '왓챠';
  return '구독 채널';
};
