'use client';

import * as React from 'react';

import { Progress } from '@/components/ui/progress';
import { usePathname } from 'next/navigation';
import { useFetchUserData, useFetchUserId } from '@/store/userStore';
import { useTotalTemperature } from '@/utils/myPage/getWarming';

export const WarmingProgress = () => {
  const pathname = usePathname();
  const { data: userData } = useFetchUserData();
  const fetchedUserId = useFetchUserId();

  //pathname에 따라 유저아이디 다르게 가져오기
  const userId = pathname === '/my-page' ? userData?.user_id || '' : fetchedUserId || '';

  // 온도 가져오기
  const { data: totalTemperature } = useTotalTemperature(userId);

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(totalTemperature as number), 500);
    return () => clearTimeout(timer);
  }, [totalTemperature]);

  return <Progress value={progress} />;
};
