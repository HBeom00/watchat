import browserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const deleteInviteList = async (invite_id: string) => {
  const { error } = await browserClient.from('invited').delete().eq('invite_id', invite_id);

  if (error) {
    throw new Error('초대 삭제 중 오류가 발생했습니다');
  }
};

export const useDeleteInviteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => deleteInviteList(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitedParties'] });
    },
    onError: (error: Error) => {
      console.error('초대 목록 삭제 에러', error.message);
    }
  });
};
