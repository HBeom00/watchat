import browserClient from "@/utils/supabase/client";

//초대하기 로직
export const inviteHandler = async (
  party_id: string,
  inviter: string,
  invitee: string
) => {
  // 초대하기 전에 이미 초대를 보냈는지 확인
  const { data } = await browserClient
    .from("invite")
    .select("*")
    .eq("inviter", inviter)
    .eq("invitee", invitee)
    .eq("party_id", party_id);
  if (data !== null) {
    alert("이미 초대장을 보냈습니다.");
    return;
  }

  // 초대하기(테스트가 필요함)
  const response = await browserClient
    .from("invited")
    .insert({ inviter, invitee, party_id });
  console.log(response);
  // if(response.error){
  //   alert('초대장 보내기를 실패했습니다.')
  // } else {
  //   alert('초대장을 보냈습니다')
  // }
};
