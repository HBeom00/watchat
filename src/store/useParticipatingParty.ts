import { useQuery } from '@tanstack/react-query';
import { getParticipatingParty } from './getParticipatingParty';

export const useParticipatingParty = (userId: string) => {
  return useQuery({
    queryKey: ['participatingParty', userId],
    queryFn: () => getParticipatingParty()
  });
};
