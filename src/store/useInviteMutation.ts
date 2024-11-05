// invitedParties에 초대받은 파티 목록 변경사항 적용하기

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptInvite, refuseInvite } from '@/store/refuseInvite';

export const useRefuseMutation = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => refuseInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitedParties', userId] });
    }
  });
};

export const useAcceptMutation = () => {
  return useMutation({
    mutationFn: (inviteId: string) => acceptInvite(inviteId),
    onSuccess: () => {
      console.log('초대 수락');
    },
    onError: (error) => {
      console.error('초대 수락 중 에러 발생:', error);
    }
  });
};
