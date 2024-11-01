import browserClient from '@/utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export type member = { profile_id: string; nickname: string; profile_image: string; user_id: string; party_id: string };

// 파티 상태 확인
export const partySituationChecker = async (party_id: string) => {
  const response: PostgrestSingleResponse<{ situation: string }[]> = await browserClient
    .from('party_info')
    .select('situation')
    .eq('party_id', party_id);
  if (response.error) {
    console.log(response.error.message);
  }
  const situation: string = response.data ? response.data[0].situation : '알수없음';
  return situation;
};

// 파티 인원 확인
export const partyMemberCounter = async (party_id: string) => {
  const response: PostgrestSingleResponse<{ profile_id: string }[]> = await browserClient
    .from('team_user_profile')
    .select('profile_id')
    .eq('party_id', party_id);
  if (response.data) {
    return response.data.length;
  }
  return 0;
};

// 멤버가 가득 찼는지 확인
export const memberFullChecker = async (party_id: string) => {
  // 참가하고자 하는 파티의 인원제한 확인
  const { data: limitMemberData, error } = await browserClient
    .from('party_info')
    .select('limited_member')
    .eq('party_id', party_id);
  const limitMember: number = limitMemberData ? limitMemberData[0].limited_member : 0;

  // 참가하고자 하는 파티의 인원 확인
  const data = await partyMemberCounter(party_id);

  // 파티 인원제한과 파티인원을 대조하여 파티가 가득 찼는지 아닌지 확인
  if (error || data === null) {
    return false;
  } else if (data && data >= limitMember) {
    return false;
  } else {
    return true;
  }
};

// 파티 상태를 모집마감으로 전환
export const memberFullSwitch = async (party_id: string) => {
  const response = await browserClient.from('party_info').update({ situation: '모집마감' }).eq('party_id', party_id);
  console.log(response);
};

// 이미 참가한 멤버인지 확인
export const isMemberExist = async (party_id: string, user_id: string | null) => {
  const response = await browserClient
    .from('team_user_profile')
    .select('profile_id')
    .eq('party_id', party_id)
    .eq('user_id', user_id);
  return response.data && response.data?.length > 0;
};

// 참가한 멤버 불러오기
export const getPartyMember = async (party_id: string) => {
  const response: PostgrestSingleResponse<member[]> = await browserClient
    .from('team_user_profile')
    .select('*')
    .eq('party_id', party_id);

  return response.data;
};
