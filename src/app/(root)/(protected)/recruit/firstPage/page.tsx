"use client";

import { useRecruitStore } from '../recruitStore';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMultiSearch } from "@/serverActions/TMDB";
import { SearchResult, SearchResponse } from '../../../../../types/Search';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import {fetchMovieWatchProvider, fetchTvWatchProvider} from "@/serverActions/TMDB"

const RecruitPage1 = () => {
  const router = useRouter();
  const nextPageHandle = () =>{router.push('/recruit/nextPage')}

    const {
        party_name,
        video_name,
        party_detail,
        duration_time,
        media_type,
        video_image,
        episode_number,
        video_platform,
        setPartyInfo,
    } = useRecruitStore();
    
    const [showResults, setShowResults] = useState(false);
    const [debouncedVideoName, setDebouncedVideoName] = useState(video_name)
    const queryClient = useQueryClient();
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

    const InputChangehandle = (value: string) => {
        setPartyInfo({ video_name: value });
        setShowResults(true);

        if (searchTimeout) {
            clearTimeout(searchTimeout); 
        }

        if(!value) {
            setPartyInfo({video_image:''})
        }

        const timeout = setTimeout(() => {
            setDebouncedVideoName(value);
        }, 300); // 300ms 후에 업데이트

        setSearchTimeout(timeout);
    };

    const { data: searchResults } = useQuery<SearchResponse>({
        queryKey: ['searchVideo', debouncedVideoName],
        queryFn: () => fetchMultiSearch(debouncedVideoName),
        enabled: !!debouncedVideoName,
    });

    const fetchProviders = async (id: number, media_type: string) => {
         try {
            const providerData = media_type === 'movie' ? await fetchMovieWatchProvider(id) : await fetchTvWatchProvider(id, 1);
            return providerData
        } catch (error) {
            console.error('플랫폼 정보를 가져오는 중 오류 발생:', error);
        }
        };

    const handleSearchResultClick = async(result: SearchResult) => {
        const video_id = result.id;
        const media_type = result.media_type;
    
        const providerData = await fetchProviders(video_id, media_type);
         setPartyInfo({
            video_name: result.title || result.name || '',
            video_image: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
            media_type: result.media_type || '',
            video_id: result.id,
            video_platform: providerData || [],
        });
        setShowResults(false);
        queryClient.invalidateQueries({ queryKey: ['searchVideo'] });
    };

    return (
        <div className='grid'>
            <h1>파티 정보 입력</h1>
            <h2>파티 이름</h2>
            <input 
            type="text" 
            placeholder="파티 이름" 
            value={party_name} 
            onChange={(e) => setPartyInfo({ party_name: e.target.value })} 
            />
            <h2>파티 상세 내용</h2>
            <input 
            type="text" 
            placeholder="파티 상세" 
            value={party_detail} 
            onChange={(e) => setPartyInfo({ party_detail: e.target.value })} 
            />
            <h2>영상 이름</h2>
            <input 
            type="text" 
            placeholder="영상 이름" 
            value={video_name} 
            onChange={(e) => InputChangehandle(e.target.value)} 
            />
            {showResults && searchResults?.results?.length ? (
                <ul>
                    {searchResults.results.map((result) => (
                        <li key={result.id} onClick={() => handleSearchResultClick(result)}>
                            {result.title || result.name}
                        </li>
                    ))}
                </ul>
            ) : null}
            {/* 포스터 */}
            {video_image && <img src={video_image} alt="선택된 포스터" />}
              
      {/* 플랫폼 */}
      <h2>제공 플랫폼</h2>
      {video_platform && (
        <div className="flex space-x-4 mt-2">
          {video_platform.map((platform) => (
            <div key={platform.name} className="text-center">
              <img src={platform.logoUrl} alt={platform.name} 
              className="w-12 h-auto mb-1" 
              />
              <p className="text-sm">{platform.name}</p>
            </div>
          ))}
        </div>
      )}
      <h2>총시청 시간</h2>
             <input type="number" placeholder="러닝 타임" value={duration_time} onChange={(e) => setPartyInfo({ duration_time: Number(e.target.value) })} />
      <h2>에피소드 번호</h2>
            {media_type === 'tv' && (
                <input type="number" placeholder="에피소드 번호" value={episode_number ?? ''} onChange={(e) => setPartyInfo({ episode_number: Number(e.target.value) })} />
            )}
            <button onClick={nextPageHandle}>다음</button>
        </div>
    );
};

export default RecruitPage1;












