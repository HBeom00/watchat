import browserClient from './supabase/client';

// 강퇴하기
export const memberExpulsion = async (party_id: string, member_Id: string) => {
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
  // 관련 파티 초대장 삭제하기
  const { error: invitedError } = await browserClient.from('invite_id').delete().eq('party_id', party_id);
  console.log(invitedError?.message);
};
