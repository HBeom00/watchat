"use client"

import browserClient from "@/utils/supabase/client"

const MemberProfileCard = ({partyNumber,memberNumber}:{partyNumber:string,memberNumber:string}) => {
  const userId = '로그인한 사용자'

  const inviteHandler = async (party_id:string, inviter:string,invitee:string)=>{
    const {data} = await browserClient.from('invite').select('*').eq('inviter',inviter).eq('invitee',invitee).eq('party_id',party_id)
    if(data!==null){
      alert('이미 초대장을 보냈습니다.')
      return;
    }
    const response = await browserClient.from('invited').insert({inviter,invitee,party_id})
    console.log(response)
  }
  return (
    <div>
      <div>
    <p>사용자 닉네임</p>
    <p>사용자 프로필이미지</p>
    <button onClick={()=>inviteHandler(partyNumber,userId,memberNumber)} className="bg-blue-400 p-6">초대하기</button>
  </div>
  </div>
  )
}

export default MemberProfileCard