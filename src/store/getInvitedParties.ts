// 초대받은 파티 목록 가져오기

import { startTimeString } from '@/utils/startTimeString';
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
    backdrop_image: string;
    limited_member: number;
    duration_time: number;
    situation: string;
    owner_id: string;
    media_type: string;
    watch_date: string;
    start_time: string;
    episode_number: number | null;
    video_id: string;
    start_date_time: string;
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
  currentPartyPeople: number;
  startString: string;
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
        backdrop_image,
        limited_member, 
        duration_time, 
        situation, 
        owner_id,
        media_type, 
        watch_date, 
        start_time, 
        episode_number, 
        video_id,
        start_date_time
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

  if (!InvitedParty) {
    return null; // 초대 목록이 없는 경우 null 반환
  }

  const partyNumberOfPeople = await Promise.all(
    InvitedParty.map(async (party) => {
      const { data: partyNumberOfPeople, error: errorPartyNumberOfPeople } = await browserClient
        .from('team_user_profile')
        .select('*')
        .eq('party_id', party.party_id);

      if (errorPartyNumberOfPeople) {
        console.error(
          `파티 ${party.party_id}의 참여 인원을 가져오는데 실패했습니다 => `,
          errorPartyNumberOfPeople.message
        );
      }

      const currentPartyPeople = partyNumberOfPeople?.length || 0;

      // 날짜&시간 변환
      const startString = startTimeString(party.party_info.start_date_time);

      return {
        ...party,
        currentPartyPeople,
        startString
      };
    })
  );
  return partyNumberOfPeople;
};
