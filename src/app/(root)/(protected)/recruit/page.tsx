"use client"

import { useEffect, useState } from "react";
import browserClient from '../../../../utils/supabase/client';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { fetchMovieWatchProvider, fetchMultiSearch, fetchTvWatchProvider } from "@/serverActions/TMDB";
import { SearchResult } from '../../../../types/Search'
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
 const [partyDetail, setPartyDetail] = useState(''); //파티내터
 const [limitedMember, setLimitedMember] = useState(''); // 모집인원 제한 10명
 const [watchDate, setWatchDate] = useState<Date|null>(null); // 시청날짜
 const [startTime, setStartTime] = useState<Date | null>(null); // 시작시간
 const [durationTime, setDurationTime] = useState(''); // 시청시간 (분)
//  const [platform, setPlatform] =  useState(''); // 제공 플랫폼
 const [platforms, setPlatforms] = useState<{ name: string, logoUrl: string }[] | null>(null); // 플랫폼 로고
 const [media, setMedia] = useState(''); // 영상 미디어
 const [poster, setPoster] = useState(''); // 영상 포스터
 const [search, setSearch] = useState<SearchResult[]>([]); // 검색 결과 리스트

 useEffect(() => {
  const searchVideo = async() => {
    if (videoName.trim()) {     //trim() 문자열 앞뒤 공백 제거
      const data = await fetchMultiSearch(videoName);
      setSearch(data.results);
    } else {
      setSearch([])
    }
  }
 searchVideo()
},[videoName])


// watch provider api 함수 movie , tv 합치기
const fetchProviders = async (id: number, mediaType: string) => {
  try {
    let providers: { name: string, logoUrl: string }[] | null = null;

    if (mediaType === 'movie') {
      providers = await fetchMovieWatchProvider(id);
    } else if (mediaType === 'tv') {
      providers = await fetchTvWatchProvider(id, 1);
    }

    console.log("Fetched Providers:", providers); // 플랫폼 정보 확인

    if (providers) {
      setPlatforms(providers);
      
    }
  } catch (error) {
    console.error('플렛폼 가져오기 오류오류', error);
  }
};


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
  // watch_date: watchDate ? watchDate.toISOString().split('T')[0] : null, // 날짜만 저장
  // start_time: startTime ? startTime.toISOString() : null, // ISO 시간 저장
  duration_time : durationTime,
  media_type : media ,
  video_platform : platforms ,
  video_image : poster
  
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
          {/* 검색된 결과 */}
          {search.length > 0 ? (
  <ul className="bg-white border border-gray-300 rounded-lg shadow-md max-h-48 overflow-y-auto">
    {search.map((result) => (
      <li 
        key={result.id}
        className="p-2 hover:bg-gray-200 cursor-pointer"
        onClick={() => {
          const videoTitle = result.title || result.name;
          const posterPath = result.poster_path; // 포스터
          const mediaType = result.media_type; // 미디어 
          if (videoTitle) {
            setVideoName(videoTitle);
          }
          if (posterPath) {
            setPoster(`https://image.tmdb.org/t/p/w500${posterPath}`); // 포스터 경로
          }
          if (mediaType) {
            setMedia(mediaType); // 미디어 타입
            fetchProviders(result.id, mediaType); // 플렛폼 정보 가져오기
          }
        }}
      >
        {result.title || result.name}
      </li>
    ))}
  </ul>
) : videoName.trim() && (
  <p className="text-gray-500 mt-2">검색된 결과가 없습니다.</p>
)}
{/* 포스터 */}
{poster && (
  <img 
    src={poster} 
    alt="선택된 영화 포스터" 
    className="w-32 h-auto mt-2 rounded-lg shadow-md" 
  />
)}
  <input 
  type="text"
   placeholder="영상 미디어를 입력해주세요" 
   value={media}
  onChange={(e) => setMedia(e.target.value)} 
  />
  {platforms && (
  <div className="flex space-x-4 mt-2">
    {platforms.map((platform) => (
      <div key={platform.name} className="text-center">
        <img src={platform.logoUrl} alt={platform.name} className="w-12 h-auto mb-1" />
        {/* <p className="text-sm">{platform.name}</p> */}
      </div>
    ))}
  </div>
)}
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
        timeIntervals={15} // 30분 간격
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
