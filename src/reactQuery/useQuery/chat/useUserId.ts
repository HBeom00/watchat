'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKey } from '../../queryKeys';
import { getUserId } from '../../queryFunc/chat/getUserId';

export const useUserId = () => {
  return useQuery({
    queryKey: queryKey.chat.userId,
    queryFn: () => getUserId(),
    initialData: false // 초기값을 false로 설정
  });
};
