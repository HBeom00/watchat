// 식빵 온도 가져오기

import { useQuery } from '@tanstack/react-query';
import { getWarming } from './getWarming';

export const useWarming = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['warming', userId],
    queryFn: () => getWarming(userId),
    enabled: !!userId
  });
};
