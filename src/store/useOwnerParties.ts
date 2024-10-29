import { useQuery } from '@tanstack/react-query';
import { getOwnerParty } from './getOwnerParties';

export const useOwnerParty = (userId: string) => {
  return useQuery({
    queryKey: ['ownerParty', userId],
    queryFn: () => getOwnerParty()
  });
};
