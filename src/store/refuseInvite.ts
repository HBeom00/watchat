// 초대를 거절할 때

import browserClient from '@/utils/supabase/client';

export const refuseInvite = async (inviteId: string) => {
  const { data, error } = await browserClient.from('invited').delete().eq('invite_id', inviteId);

  if (data) {
    console.log('초대 거절에 성공했습니다 => ', data);
  }
  if (error) {
    console.error('초대 거절에 성공했습니다 => ', error.message);
  }
};
