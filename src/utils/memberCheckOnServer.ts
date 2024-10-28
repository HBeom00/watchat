import { createClient } from './supabase/server';

// 파티 상태 확인
export const partySituationCheckerOnServer = async (party_id: string) => {
  const supabase = createClient();
  const { data } = await supabase.from('party_info').select('situation').eq('party_id', party_id);
  console.log('파티상태체크', data);

  const situation: string = data ? data[0].situation : '알수없음';
  return situation;
};

// 멤버가 가득 찼는지 확인
export const memberFullCheckerOnServer = async (party_id: string) => {
  const supabase = createClient();
  // 참가하고자 하는 파티의 인원제한 확인
  const { data: limitMemberData } = await supabase.from('party_info').select('limited_member').eq('party_id', party_id);
  const limitMember: number = limitMemberData ? limitMemberData[0].limited_member : 0;

  // 참가하고자 하는 파티의 인원 확인
  const { data } = await supabase.from('team_user_profile').select('profile_id').eq('party_id', party_id);
  console.log('멤버가 가득 찼는지 확인', data);

  // 파티 인원제한과 파티인원을 대조하여 파티가 가득 찼는지 아닌지 확인
  if (!data) {
    return false;
  } else if (data.length <= limitMember) {
    return false;
  } else {
    return true;
  }
};

// 파티 상태를 모집마감으로 전환
export const memberFullSwitchOnServer = async (party_id: string) => {
  const supabase = createClient();
  const response = await supabase.from('party_info').update({ situation: '모집마감' }).eq('party_id', party_id);
  console.log('파티상태를 모집마감으로 전환', response);
};

// 이미 참가한 멤버인지 확인
export const isMemberExistOnServer = async (party_id: string, user_id: string | null) => {
  const supabase = createClient();
  if (!user_id) return false;
  const response = await supabase
    .from('team_user_profile')
    .select('profile_id')
    .eq('party_id', party_id)
    .eq('user_id', user_id);

  return response.data && response.data.length !== 0;
};
