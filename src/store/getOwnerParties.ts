// 주최한 파티 목록 가져오기

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';

// 파티 정보 타입
type OwnerPartyInfo = {
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

// ownerPartyInfo (통틀어서 반환되는 값) 타입
interface OwnerParty extends OwnerPartyInfo {
  ownerProfile: OwnerProfile;
  currentPartyPeople: number | undefined; // 참여 인원수
}

export const getOwnerParty = async (): Promise<OwnerParty[]> => {
  const userId = await getLoginUserIdOnClient();

  const { data: ownerParties, error } = await browserClient.from('party_info').select('*').eq('owner_id', userId);

  if (error) {
    console.error('주최한 파티 목록을 불러오는데 실패했습니다 => ', error);
    return [];
  }

  const ownerPartiesWithDetails = await Promise.all(
    ownerParties.map(async (party) => {
      if (!party.owner_id) {
        console.error(`(주최한 파티) owner_id가 없습니다`);
        return { ...party, ownerProfile: { profile_img: '', nickname: '알 수 없음' }, currentPartyPeople: 0 };
      }

      // 작성자 정보 가져오기
      const { data: ownerData, error: ownerError } = await browserClient
        .from('user')
        .select('profile_img, nickname')
        .eq('user_id', party.owner_id)
        .single();

      if (ownerError) {
        console.error('(주최한 파티) 작성자 정보를 불러오는데 실패했습니다 => ', ownerError.message);
      }

      // 참여 인원수 가져오기
      const { data: partyNumberOfPeople, error: errorPartyNumberOfPeople } = await browserClient
        .from('team_user_profile')
        .select('*')
        .eq('party_id', party.party_id);

      if (errorPartyNumberOfPeople) {
        console.error('(주최한 파티) 참여 인원을 불러오는데 실패했습니다 => ', errorPartyNumberOfPeople.message);
      }

      const currentPartyPeople = partyNumberOfPeople?.length;

      return {
        ...party,
        ownerProfile: ownerData || { profile_img: '', nickname: '알 수 없음' },
        currentPartyPeople
      };
    })
  );

  return ownerPartiesWithDetails;
};