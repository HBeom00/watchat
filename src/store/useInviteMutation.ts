import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refuseInvite } from '@/store/refuseInvite';

export const useRefuseMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => refuseInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitedParties', userId] });
    }
  });
};
