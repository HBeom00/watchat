// 'use client';

// import { useRouter } from 'next/navigation';
// import { useRecruitStore } from '@/store/recruitStore';
// import { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchMultiSearch } from '@/serverActions/TMDB';

// const MultiSearch = () => {
//   const router = useRouter();
//   const setVideoInfo = useRecruitStore((state) => state.setPartyInfo);
//   const [videoName, setVideoName] = useState('');
//   const [debouncedVideoName, setDebouncedVideoName] = useState(videoName);

//   // 검색 결과 API 호출
//   const { data: searchResults } = useQuery({
//     queryKey: ['searchVideo', debouncedVideoName],
//     queryFn: () => fetchMultiSearch(debouncedVideoName),
//     enabled: !!debouncedVideoName
//   });

//   // 디바운싱
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedVideoName(videoName), 300);
//     return () => clearTimeout(timer);
//   }, [videoName]);

//   const handleSearchResultClick = (result) => {
//     // 선택된 영화 정보를 zustand에 저장
//     setVideoInfo({
//       video_name: result.title || result.name || '',
//       video_image: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
//       media_type: result.media_type || '',
//       video_id: result.id || null
//     });

//     // FirstPage로 이동
//     router.push('/recruit/firstPage');
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="검색어를 입력하세요"
//         value={videoName}
//         onChange={(e) => setVideoName(e.target.value)}
//       />
//       <ul>
//         {searchResults?.results.map((result) => (
//           <li key={result.id} onClick={() => handleSearchResultClick(result)}>
//             {result.title || result.name}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MultiSearch;
