import { useQuery } from '@tanstack/react-query';
import { getRecommendParty } from './getRecommendParty';

export const useRecommendParty = (userId: string) => {
  return useQuery({
    queryKey: ['recommendParty', userId],
    queryFn: () => getRecommendParty()
  });
};
