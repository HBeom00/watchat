// 내가 참여한 파티 목록 가져오기

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';

// 파티 정보 타입
type PartyInfo = {
  duration_time: number;
  episode_number?: number | null;
  limited_member: number;
  media_type: string;
  owner_id: string;
  party_detail: string;
  party_id: string;
  party_name: string;
  situation: string;
  start_time: string;
  video_id: number;
  video_image: string;
  video_name: string;
  video_platform: string;
  watch_date: string;
};

// 작성자 정보 타입
interface OwnerProfile {
  profile_img: string;
  nickname: string;
}

// partyWithDetails (통틀어서 반환되는 값) 타입
interface ParticipatingParty extends PartyInfo {
  ownerProfile: OwnerProfile; // 파티 오너정보
  currentPartyPeople: number | undefined; // 참여 인원수
}

// 참여한 파티 불러오기
export const getParticipatingParty = async (): Promise<ParticipatingParty[]> => {
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
    console.error('(참여한 파티) 정보를 불러오는데 실패했습니다. => ', partyIdError);
    return [];
  }

  const partyWithDetails = await Promise.all(
    partyInfo.map(async (party) => {
      if (!party.owner_id) {
        console.error(`(참여한 파티) owner_id가 없습니다`);
        return { ...party, ownerProfile: { profile_img: '', nickname: '알 수 없음' }, currentParticipants: 0 };
      }

      // 작성자 정보 가져오기
      const { data: ownerData, error: ownerError } = await browserClient
        .from('user')
        .select('profile_img, nickname')
        .eq('user_id', party.owner_id)
        .single();

      if (ownerError) {
        console.error('(참여한 파티) 작성자 정보를 불러오는데 실패했습니다 => ', ownerError.message);
      }

      // 참여 인원수 가져오기
      const { data: partyNumberOfPeople, error: errorPartyNumberOfPeople } = await browserClient
        .from('team_user_profile')
        .select('*')
        .eq('party_id', party.party_id);

      if (errorPartyNumberOfPeople) {
        console.error('(참여한 파티) 참여 인원을 불러오는데 실패했습니다 => ', errorPartyNumberOfPeople.message);
      }

      const currentPartyPeople = partyNumberOfPeople?.length;

      return {
        ...party,
        ownerProfile: ownerData || { profile_img: '', nickname: '알 수 없음' },
        currentPartyPeople
      };
    })
  );
  return partyWithDetails;
};
