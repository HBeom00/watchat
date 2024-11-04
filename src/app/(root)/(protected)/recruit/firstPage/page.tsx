"use client";

import { useRecruitStore } from '../recruitStore';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMultiSearch } from "@/serverActions/TMDB";
import { SearchResult, SearchResponse } from '../../../../../types/Search';
import { useEffect, useState } from "react";
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

    useEffect(() => {
        //상태 초기화
        setPartyInfo({
    party_name: '',
    video_name: '',
    party_detail: '',
    limited_member: 0,
    watch_date: null,
    start_time: null,
    duration_time: 0,
    video_platform: [],
    video_image: '',
    episode_number: null,
        });

    // 캐시 초기화 재렌더링
    queryClient.refetchQueries({ queryKey: ['searchVideo'] as const })
    }, [queryClient, setPartyInfo] )

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
            popularity: result.popularity,
            backdrop_image: result.backdrop_path
        });
        setShowResults(false);
        queryClient.invalidateQueries({ queryKey: ['searchVideo'] });
    };
    
    // 필요한 필드의 상태를 검사하는 조건 추가
const isNextButtonDisabled = !party_name || !video_name || !party_detail || (media_type === 'tv' && !episode_number) || !duration_time;

    return (
        <div className='grid place-items-center'>
            <h1 className='text-[28px] font-bold mt-[48px]'>파티 모집하기</h1>
            <input 
            type="text" 
            placeholder="파티 이름" 
            value={party_name} 
            onChange={(e) => setPartyInfo({ party_name: e.target.value })} 
            className='bg-Grey-50 w-[519px] h-[48px] rounded-lg mt-[24px] '
            />
            <input 
            type="text" 
            placeholder="파티에 대해서 소개해주세요." 
            value={party_detail} 
            onChange={(e) => setPartyInfo({ party_detail: e.target.value })} 
            className='mt-[16px] bg-Grey-50 w-[520px] h-[112px] rounded-lg'
            />
            <div className='flex w-[519px] justify-center align-item gap-1 mt-[32px]'>
            <h2 
            className='text-gray-800 font-pretendard text-[15px] font-semibold leading-[24px]'
            >시청할 영상을 선택해 주세요.</h2>
            <h2 className='text-purple-600 font-[15px] '>*</h2>
            </div>
            <div className='relative w-[519px]'>
    <input 
        type="text" 
        placeholder="선택하세요." 
        value={video_name} 
        onChange={(e) => InputChangehandle(e.target.value)}
        className='w-full h-[48px] px-4 border border-Grey-300 rounded-md text-[15px] text-gray-800'
    />
    {showResults && searchResults?.results?.length ? (
        <ul className='absolute top-[50px] w-full max-h-[190px] overflow-y-auto border border-Grey-300 border-t-0 rounded-b-md bg-white z-10'>
            {searchResults.results.map((result) => (
                <li 
                    key={result.id} 
                    onClick={() => handleSearchResultClick(result)}
                    className='px-4 py-3 text-[15px] text-gray-800 cursor-pointer hover:bg-gray-100'
                >
                    {result.title || result.name}
                </li>
            ))}
        </ul>
    ) : null}
</div>
        <div className='flex space-x-[20px] mt-[16px]'>
            {/* 포스터 */}
            {video_name && video_image && <img 
            src={video_image} 
            alt="선택된 포스터" 
            className='w-[250px] h-[351px] rounded-md'/>}
              
              <div className='space-y-[20px]'>
              {media_type === 'tv' && (
                <div>
                <div className='flex'>
                <h2>회차</h2>
                <h2 className='text-purple-600'>*</h2>
                </div>
                <input 
                type="text" 
                placeholder="시청할 회차를 입력하세요" 
                value={episode_number ?? ''} 
                onChange={(e) => setPartyInfo({ episode_number: Number(e.target.value) })} 
                className='h-[48px] w-[249px] rounded-md border-[1px] border-Grey-300'
                />
            </div>)}

            
            { video_name && video_image &&
            <div>
            <div className='flex'>
            <h2>러닝타임</h2>
            <h2 className='text-purple-600'>*</h2>
            </div>
            <input 
            type="text" 
            placeholder="00:00:00" 
            value={duration_time!== 0? duration_time:''} 
            onChange={(e) => setPartyInfo({ duration_time: Number(e.target.value) })} 
            className='h-[48px] w-[249px] rounded-md border-[1px] border-Grey-300'
            />
            </div>}
      {/* 플랫폼 */}
      
      {video_name && video_platform && video_platform.length ? (
        <div>
        <h2>영상 플랫폼</h2>
        <div className="flex space-x-4 mt-2">
          {video_platform.map((platform) => (
            <div key={platform.name} className="text-center">
              <img 
              src={platform.logoUrl} alt={platform.name} 
              className="w-12 h-auto mb-1" 
              />
            </div>
          ))}
        </div>
        </div>
      ): null}
      </div>
            </div>
            <button 
            className='btn-xl'
            // className={`mt-[37px] px-[24px] py-[16px] w-[520px] h-[56px] ${isNextButtonDisabled ? 'bg-Grey-100 text-Grey-400' : 'bg-primary-400 hover:bg-primary-500 text-white'} rounded-md font-semibold text-[15px]`}
            onClick={nextPageHandle}
            disabled={isNextButtonDisabled}
            >다음</button>
        </div>
    );
};

export default RecruitPage1;



// 버튼 컴포넌트 만들기 ***** 컬러. 크기 . 등등 프롭스로 받아서 변경이 쉽게

