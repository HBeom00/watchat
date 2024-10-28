import browserClient from './supabase/client';

// 강퇴하기
export const memberExpulsion = async (member_Id: string, party_id: string) => {
  const { error } = await browserClient
    .from('team_user_profile')
    .delete()
    .eq('profile_id', member_Id)
    .eq('party_id', party_id);

  if (error) {
    console.log(error.message);
  }
};

// 파티 종료하기
export const partyEnd = async (party_id: string) => {
  const { error } = await browserClient.from('party_info').update({ situaion: '종료' }).eq('party_id', party_id);
  console.log(error?.message);
};
