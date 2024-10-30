// 초대받은 파티 목록 가져오기

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';

interface InvitedParty {
  invite_id: string;
  inviter: string;
  invitee: string;
  party_id: string;
  party_info: {
    party_name: string;
    video_name: string;
    video_platform: string;
    video_image: string;
    limited_member: number;
    duration_time: number;
    situation: string;
    owner_id: string;
    media_type: string;
    watch_date: string;
    start_time: string;
    episode_number: number | null;
    video_id: string;
  };
  inviter_user: {
    user_id: string;
    nickname: string;
    profile_img: string;
  };
  invitee_user: {
    user_id: string;
    nickname: string;
    profile_img: string;
  };
}

// supabase에서 초대정보 불러오기
export const getInvitedParties = async (): Promise<InvitedParty[] | null> => {
  const userId = await getLoginUserIdOnClient();
  console.log('유저ID => ', userId);

  const { data: InvitedParty, error: inviteListError } = await browserClient
    .from('invited')
    .select(
      `
      invite_id, 
      inviter, 
      invitee, 
      party_id,
      party_info:party_id (
        party_name, 
        video_name, 
        video_platform, 
        video_image,
        limited_member, 
        duration_time, 
        situation, 
        owner_id,
        media_type, 
        watch_date, 
        start_time, 
        episode_number, 
        video_id
      ),
      inviter_user:inviter (
        user_id, 
        nickname, 
        profile_img
      ),
      invitee_user:invitee (
        user_id,     
        nickname, 
        profile_img
      )
      `
    )
    .eq('invitee', userId)
    .returns<InvitedParty[]>();

  if (inviteListError) {
    console.error('초대목록을 불러오는데 실패했습니다. => ', inviteListError?.message);
  }

  return InvitedParty;
};
