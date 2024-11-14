import { memberScarceSwitch } from './memberCheck';
import browserClient from './supabase/client';

// 강퇴하기
export const memberExpulsion = async (party_id: string, member_Id: string) => {
  // 파티 나가기
  const { error } = await browserClient
    .from('team_user_profile')
    .delete()
    .eq('user_id', member_Id)
    .eq('party_id', party_id);

  if (error) {
    console.log(error.message);
    return;
  }
  // 모집 상태 변경
  await memberScarceSwitch(party_id);

  //이미지 삭제
  const { error: deleteError } = await browserClient.storage
    .from('team_user_profile_image')
    .remove([`${party_id}/${member_Id}`]);
  if (deleteError) {
    console.log('이미지 삭제를 실패했습니다', deleteError.message);
  }
};

// 파티 종료하기
export const partyEnd = async (party_id: string) => {
  const { error } = await browserClient.from('party_info').update({ situation: '종료' }).eq('party_id', party_id);
  if (error) {
    console.log(error.message);
  }
  if (!error) {
    const { error: invitedError } = await browserClient.from('invited').delete().eq('party_id', party_id);
    console.log(invitedError?.message);
    if (!invitedError) {
      alert('파티가 종료되었습니다.');
      return true;
    }
  }
};
