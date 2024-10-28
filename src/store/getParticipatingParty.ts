import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';

// 참여한 파티 불러오기
export const getParticipatingParty = async () => {
  // type participatingParty = {
  //   duration_time: number | null;
  //   episode_number: number | null;
  //   limited_member: number;
  //   media_type: string | null;
  //   owner_id: string | null;
  //   party_detail: string;
  //   party_id: string;
  //   party_name: string;
  //   situation: string | null;
  //   start_time: string | null;
  //   video_id: number | null;
  //   video_image: string | null;
  //   video_name: string;
  //   video_platform: string | null;
  //   watch_date: string | null;
  // };
  const userId = await getLoginUserIdOnClient();

  // 파티 목록 가져오기
  const { data: partyId, error: partyIdError } = await browserClient
    .from('team_user_profile')
    .select(`party_id`)
    .eq('user_id', userId);

  if (partyId) {
    console.log('참여한 파티 목록 => ', partyId);
  }
  if (partyIdError) {
    console.error('참여한 파티 목록을 불러오는데 실패했습니다 => ', partyIdError.message);
  }

  const partyIds = partyId?.map((party) => party.party_id) || [];

  // 파티 정보 가져오기
  const { data: partyInfo, error: partyInfoError } = await browserClient
    .from('party_info')
    .select('*')
    .in('party_id', partyIds);

  if (partyInfo) {
    console.log('참여한 파티 정보 => ', partyInfo);
  }
  if (partyInfoError) {
    console.error('참여한 파티 정보를 불러오는데 실패했습니다. => ', partyIdError);
    return [];
  }

  const partyWithDetails = await Promise.all(
    partyInfo.map(async (party) => {
      const { data: ownerData, error: ownerError } = await browserClient
        .from('user')
        .select('profile_img, nickname')
        .eq('id', party.owner_id)
        .single();

      if (ownerError) {
        console.error('(참여한 파티) 작성자 정보를 불러오는데 실패했습니다 => ', ownerError);
      }
    })
  );
};
