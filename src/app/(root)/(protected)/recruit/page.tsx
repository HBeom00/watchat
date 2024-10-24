"use client"

import { useState } from "react";
import browserClient from '../../../../utils/supabase/client';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker'

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
 const [watchDate, setWatchDate] = useState<Date|null>(null); // 시청날짜
 const [startTime, setStartTime] = useState<Date | null>(null); // 시작시간
 const [durationTime, setDurationTime] = useState(''); // 시청시간 (분)
 const [platform, setPlatform] = useState(''); // 제공 플랫폼
 const [media, setMedia] = useState(''); // 영상 미디어


 const submitHandle = async() => {
  const {data, error} = await browserClient
  .from('party_info')
  .insert([
    {
  party_detail : partyDetail,
  party_name : partyName,
  video_name : videoName,
  limited_member : limitedMember,
  watch_date : watchDate,
  start_time : startTime,
  duration_time : durationTime,
  media_type : media ,
  video_platform : platform 
    }
  ]);
  if (error) {
    console.error("insert 에러에러",error)
  } else {
    console.log("데이터 삽입 성공", data)
  }
 }

 const timeChangeHandle = (time: Date | null) => {
  if (time) {
    setStartTime(time); 
  }
};


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
   placeholder="제공 플랫폼을 입력해주세요" 
   value={platform}
  onChange={(e) => setPlatform(e.target.value)} 
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
   {/* 시청날짜 */}
     <DatePicker
        selected={watchDate}
        onChange={(date: Date | null) => setWatchDate(date)} // 날짜 선택 시 상태 업데이트
        dateFormat="yyyy.MM.dd" // 원하는 날짜 형식
        placeholderText="날짜를 선택해주세요"
        className="p-2 border border-gray-300 rounded-lg shadow-sm"
        showPopperArrow={false}
      />
  {/* 시청시작시간 */}
  {/* \"2024-10-23T21:00:00.629Z\" ISO형식으로 들어옴*/}
      <DatePicker
        selected={startTime}
        onChange={timeChangeHandle} // 시간 선택 시 상태 업데이트
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30} // 30분 간격
        timeCaption="시간"
        dateFormat="h:mm aa" // AM/PM 형식
        className="p-2 border border-gray-300 rounded-lg shadow-sm"
        placeholderText="시간을 선택해주세요"
      />
  <input 
  type="text" 
  placeholder="파티 상세 소개를 입력해주세요" 
  value={partyDetail}
  onChange={(e) => setPartyDetail(e.target.value)} 
  />
  <button onClick={submitHandle}>모집하기</button>
 </div>
    </>
  )
  
};

export default RecruitPage;
