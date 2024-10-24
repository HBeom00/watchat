"use client"

import { useState } from "react";
import browserClient from '../../../../utils/supabase/client';

// interface recruit {
//   party_id : number;
//   video_id : number;
//   owner_id : number;
//   party_detail : string;
//   party_name : string;
//   viedo_name : string;
//   limited_member : number;
//   start_time : string;
//   duration_time : number;
//   situation : string;
//   media_type : string;
//   // video_platform : string;
//   // video_image : string;
//   // party_end_time : string;
// }
const RecruitPage = () => {
 const [partyName, setPartyName] = useState(''); // 파티이름
 const [videoName, setVideoName] = useState(''); // 영상이름
 const [partyDetail, setPartyDetail] = useState(''); //파티내용
 const [limitedMember, setLimitedMember] = useState(''); // 모집인원 제한 10명
 const [startTime, setStartTime] = useState(''); // 시작시간
 const [durationTime, setDurationTime] = useState(''); // 시청시간 (분)
 const [media, setMedia] = useState('');

 const handleSubmit = async() => {
  const {data, error} = await browserClient
  .from('party_info')
  .insert([
    {
  party_detail : partyDetail,
  party_name : partyName,
  video_name : videoName,
  limited_member : limitedMember,
  start_time : startTime,
  duration_time : durationTime,
  media_type : media ,
    }
  ]);
  if (error) {
    console.error("insert 에러에러",error)
  } else {
    console.log("데이터 삽입 성공", data)
  }
 }

  return (
    <>
 <div className="grid">
  <h1>파티 모집하기</h1>
  <input 
  type="text"
  placeholder="파티명을 입력해주세요"
  value={partyName}
  onChange={(e) => setPartyName(e.target.value)} 
  />
  <input 
  type="text" 
  placeholder="영상명을 입력해주세요"
  value={videoName}
  onChange={(e) => setVideoName(e.target.value)}  
  />
  <input 
  type="text"
   placeholder="영상 미디어를 입력해주세요" 
   value={media}
  onChange={(e) => setMedia(e.target.value)} 
  />
  <input 
  type="text" 
  placeholder="러닝 타임" 
  value={durationTime}
  onChange={(e) => setDurationTime(e.target.value)} 
  />
  <input 
  type="text" 
  placeholder="모집 인원을 입력해주세요(최대10명)"
  value={limitedMember}
  onChange={(e) => setLimitedMember(e.target.value)} 
   />
  <input 
  type="text" 
  placeholder="시청 시작을 입력해주세요" 
  value={startTime}
  onChange={(e) => setStartTime(e.target.value)} 
  />
  <input 
  type="text" 
  placeholder="파티 상세 소개를 입력해주세요" 
  value={partyDetail}
  onChange={(e) => setPartyDetail(e.target.value)} 
  />
  <button onClick={handleSubmit}>모집하기</button>
 </div>
    </>
  )
  
};

export default RecruitPage;
