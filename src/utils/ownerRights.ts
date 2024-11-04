import browserClient from './supabase/client';

// 강퇴하기
export const memberExpulsion = async (party_id: string, member_Id: string) => {
  // 파티 나가기
  const { data, error } = await browserClient
    .from('team_user_profile')
    .delete()
    .eq('user_id', member_Id)
    .eq('party_id', party_id)
    .select('profile_id');

  if (error) {
    console.log(error.message);
  }
  // 모집 상태 변경
  const situationResponse = await browserClient.from('party_info').select('situation').eq('party_id', party_id);
  if (situationResponse.data && situationResponse.data[0].situation === '모집완료') {
    const { error: updateError } = await browserClient
      .from('party_info')
      .update({ situation: '모집중' })
      .eq('party_id', party_id);
    if (updateError) {
      console.log(updateError.message);
    }
  }

  //이미지 삭제
  const { error: deleteError } = await browserClient.storage
    .from('team_user_profile_image')
    .remove([data?.[0].profile_id]);
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
