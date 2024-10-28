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
 const [platforms, setPlatforms] = useState<{ name: string, logoUrl: string }[] | null>(null); // 플랫폼 로고
 const [media, setMedia] = useState(''); // 영상 미디어
 const [poster, setPoster] = useState(''); // 영상 포스터
 const [search, setSearch] = useState<SearchResult[]>([]); // 검색 결과 리스트
 const [videoId, setVideoId] = useState<number | null> (null); // 영화 ID 
 const [episodeNumber, setEpisodeNumber] = useState<number | null>(null); // 에피소드 번호
 const [noResults, setNoResults] = useState(false) // 검색결과 없는 상태


 useEffect(() => {
  const searchVideo = async() => {
    if (videoName.trim()) {     //trim() 문자열 앞뒤 공백 제거
      const data = await fetchMultiSearch(videoName);
      setSearch(data.results);
      setNoResults(data.results.length === 0) // 결과가 없으면 true
    } else {
      setSearch([])
      setNoResults(false); // 검색어가 비어있으면 false
    }
  }
 searchVideo()
},[videoName])


// watch provider api 함수 movie , tv 합치기
const fetchProviders = async (id: number, mediaType: string) => {
  try {
    let providers: { name: string, logoUrl: string }[] | null = null;

    if (mediaType === 'movie') {
      providers = await fetchMovieWatchProvider(id); // 영화 플랫폼
    } else if (mediaType === 'tv') {
      providers = await fetchTvWatchProvider(id, 1); // 티비
    }
    if (providers) {
      setPlatforms(providers);
      
    }
  } catch (error) {
    console.error('플렛폼 가져오기 오류오류', error);
  }
};


// 검색 결과 클릭 시 ID 상태 설정
const searchResultClickHandler = (result: SearchResult) => {
  const videoTitle = result.title || result.name;
  const posterPath = result.poster_path;
  const mediaType = result.media_type;
  
  if (videoTitle) {
      setVideoName(videoTitle);
  }
  if (posterPath) {
      setPoster(`https://image.tmdb.org/t/p/w500${posterPath}`);
  }
  if (mediaType) {
      setMedia(mediaType);
      fetchProviders(result.id, mediaType);
  }
  setVideoId(result.id); // 선택된 영화 ID 설정
  setSearch([])
  setNoResults(false) // 결과없음 메시지 숨기기
};


 const submitHandle = async() => {
  const { data: userData, error: userError } = await browserClient.auth.getUser();
  
  if (userError || !userData) {
    console.error("유저 정보를 못가져왔음", userError);
    return;
  }
  
  const userId = userData.user.id;

  const {data, error} = await browserClient
  .from('party_info')
  .insert([
    {
  party_detail : partyDetail,
  party_name : partyName,
  video_name : videoName,
  limited_member : limitedMember,
  video_id: videoId,
  watch_date: watchDate ? watchDate.toISOString().split('T')[0] : null, // 날짜만 저장
  start_time: startTime ? startTime.toISOString().split('T')[1] : null, // 시간만 저장
  duration_time : durationTime,
  media_type : media ,
  video_platform : platforms ,
  video_image : poster,
  situation : "모집중",
  owner_id : userId,
  episode_number : media === "tv" ? episodeNumber : null,  // media가 "tv"일 때만 episode_number 저장
    }
  ]);
  if (error) {
    console.error("insert 에러에러",error)
  } else {
    alert("모집이 업로드 되었습니다.")
    // 모집 상세 페이지로 
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
  placeholder="파티 상세 소개를 입력해주세요" 
  value={partyDetail}
  onChange={(e) => setPartyDetail(e.target.value)} 
  />
  <h2>시청할 영상을 검색하세요</h2>
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
     onClick={() => searchResultClickHandler(result)}
 >
     {result.title || result.name}
      </li>
    ))}
  </ul>
) : noResults && (
  <ul className="bg-white border border-gray-300 rounded-lg shadow-md max-h-48 overflow-y-auto">
    <li className="p-2 text-gray-500">검색된 결과가 없습니다.</li>
  </ul>
)}
{/* 포스터 */}
{poster && (
  <img 
    src={poster} 
    alt="선택된 영화 포스터" 
    className="w-32 h-auto mt-2 rounded-lg shadow-md" 
  />
)}
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
   placeholder="영상 미디어를 입력해주세요" 
   value={media}
  onChange={(e) => setMedia(e.target.value)} 
  />
   {/* media가 'tv'인 경우에만 episode_number 입력란 표시 */}
   {media === "tv" && (
        <input 
          type="number" 
          placeholder="에피소드 번호를 입력해주세요" 
          value={episodeNumber ?? ''} 
          onChange={(e) => setEpisodeNumber(Number(e.target.value))}
        />
      )}
<h2>러닝 타임</h2>
  <input 
  type="text" 
  placeholder="러닝 타임을 입력해주세요." 
  value={durationTime}
  onChange={(e) => setDurationTime(e.target.value)} 
  />
  <h2>모집 인원</h2>
   <select  
   id="limitedMember"
   value={limitedMember}
   onChange={(e) => setLimitedMember(e.target.value)}
   className="p-2 border border-gray-300 rounded-lg shadow-sm"
   >
    <option value="">인원 선택</option>
    {Array.from({ length: 10}, (_, i) => (
      <option key={i+1} value={i+1}>
        {i+1}명
      </option>
    ))}
   </select>
   {/* 시청날짜 */}
   <h2>시청 날짜</h2>
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
  <h2>시청 시작시간</h2>
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
  
  <button onClick={submitHandle}>모집하기</button>
 </div>
    </>
  )
  
};

export default RecruitPage;
