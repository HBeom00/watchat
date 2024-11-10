'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchMultiSearch,
  fetchMovieWatchProvider,
  fetchTvWatchProvider,
  fetchMoviesDetail,
  fetchTvDetail,
  fetchTvEpisode
} from '@/serverActions/TMDB';
import { SearchResult, SearchResponse } from '../../../../../types/Search';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecruitData } from '@/types/partyInfo';
import CustomSelect from '@/components/recruit/CustomSelect';
import Image from 'next/image';

const RecruitFirstPage = () => {
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [debouncedVideoName, setDebouncedVideoName] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [partyInfo, setPartyInfo] = useState<RecruitData>({
    party_name: '',
    video_name: '',
    video_image: '',
    party_detail: '',
    duration_time: 0,
    media_type: '',
    video_platform: [], // 빈 배열로 초기화
    episode_number: 0,
    season_number: 0,
    watch_date: null,
    start_time: null,
    limited_member: 0,
    video_id: null,
    popularity: null,
    backdrop_image: ''
  });

  // 검색 결과 쿼리
  const { data: searchResults } = useQuery<SearchResponse>({
    queryKey: ['searchVideo', debouncedVideoName],
    queryFn: () => fetchMultiSearch(debouncedVideoName),
    enabled: !!debouncedVideoName
  });

  const InputChangehandle = (value: string) => {
    setPartyInfo({ ...partyInfo, video_name: value });
    setShowResults(true);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setDebouncedVideoName(value); // 300ms 후에 검색어 업데이트
    }, 300);

    setSearchTimeout(timeout); // 타임아웃 ID 저장
  };

  const fetchProviders = async (id: number, media_type: string) => {
    try {
      return media_type === 'movie' ? await fetchMovieWatchProvider(id) : await fetchTvWatchProvider(id, 1);
    } catch (error) {
      console.error('플랫폼 정보를 가져오는 중 오류 발생:', error);
    }
  };

  // 검색창 클릭
  const handleSearchResultClick = async (result: SearchResult) => {
    const video_id = result.id;
    const media_type = result.media_type;

    //플렛폼 정보 불러오기
    const providerData = await fetchProviders(video_id, media_type);

    //영화/TV 상세 정보 불러오기
    let duration = 0;
    if (media_type === 'movie') {
      const movieDetail = await fetchMoviesDetail(video_id);
      duration = movieDetail?.detail.runtime || 0; // 영화 런타임
    } else if (media_type === 'tv') {
      const tvDetail = await fetchTvDetail(video_id);
      duration = tvDetail?.detail.episode_run_time[0] || 0; // TV 에피소드 런타임
    }
    setPartyInfo({
      ...partyInfo,
      video_name: result.title || result.name || '',
      video_image: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
      media_type: result.media_type || '',
      video_id: result.id,
      video_platform: providerData || [],
      popularity: result.popularity,
      backdrop_image: result.backdrop_path as string,
      duration_time: duration,
      season_number: 0
    });
    setShowResults(false);
  };

  const seasonOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} 시즌`
  }));

  const seasonHandle = (seasonNum: string | number) => {
    setPartyInfo({ ...partyInfo, season_number: Number(seasonNum) });
  };

  const episodeHandle = async (episodeNum: string) => {
    const episodeNumber = Number(episodeNum);
    const { season_number, video_id } = partyInfo;

    setPartyInfo({ ...partyInfo, episode_number: episodeNumber });

    // 회차 없을때 러닝타임 초기화
    if (!episodeNum) {
      setPartyInfo({ ...partyInfo, duration_time: 0 });
      return;
    }
    // media_type, episodeNumber, seasonNumber, seriesId가 존재할 때만 실행
    if (episodeNumber && season_number && video_id) {
      const episodeDetail = await fetchTvEpisode(video_id, season_number, episodeNumber);

      // 런타임이 있을 경우 duration_time에 설정
      if (episodeDetail?.runtime) {
        setPartyInfo({ ...partyInfo, duration_time: episodeDetail.runtime });
        setError(null); // 오류 메시지 초기화
      } else {
        setError('런타임 정보가 없습니다.');
      }
    }
  };

  const nextPageHandle = () => {
    const queryString = new URLSearchParams({
      party_name: partyInfo.party_name,
      party_detail: partyInfo.party_detail || '',
      video_id: partyInfo.video_id?.toString() || '',
      video_name: partyInfo.video_name,
      video_platform: JSON.stringify(partyInfo.video_platform),
      video_image: partyInfo.video_image,
      media_type: partyInfo.media_type,
      duration_time: partyInfo.duration_time.toString(),
      episode_number: partyInfo.episode_number?.toString() || '',
      popularity: partyInfo.popularity?.toString() || '',
      backdrop_image: partyInfo.backdrop_image,
      season_number: partyInfo.season_number.toString()
    }).toString();

    if (!isNextButtonDisabled) {
      router.push(`/recruit/nextPage?${queryString}`);
    }
  };
  // 인풋 값 입력시 버튼 활성화
  const isNextButtonDisabled =
    !partyInfo.party_name || !partyInfo.video_name || !partyInfo.party_detail || !partyInfo.duration_time;

  return (
    <div className="grid place-items-center ">
      <h1 className="text-[28px] font-bold mt-[70px]">파티 모집하기</h1>
      <input
        type="text"
        placeholder="파티 이름"
        value={partyInfo.party_name}
        onChange={(e) => setPartyInfo({ ...partyInfo, party_name: e.target.value })}
        className="bg-Grey-50 px-[16px] py-[12px] w-[519px] h-[48px] rounded-lg mt-[24px] border border-1 border-Grey-50 focus:border-primary-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="파티에 대해서 소개해주세요."
        value={partyInfo.party_detail}
        onChange={(e) => setPartyInfo({ ...partyInfo, party_detail: e.target.value })}
        className="mt-[16px] px-[16px] py-[12px] bg-Grey-50 w-[520px] h-[112px] rounded-lg border border-1 border-Grey-50 focus:border-primary-500 focus:outline-none"
      />
      <div className="flex w-[520px]  align-item gap-1 mt-[32px] ">
        <h2 className="text-gray-800 font-pretendard text-[15px] font-semibold leading-[24px]">
          시청할 영상을 선택해 주세요.
        </h2>
        <h2 className="text-purple-600 font-[15px] ">*</h2>
      </div>
      <div className="relative w-[519px]  mt-[16px]">
        <input
          type="text"
          placeholder="선택하세요."
          value={partyInfo.video_name}
          onChange={(e) => {
            setPartyInfo({ ...partyInfo, video_name: e.target.value });
            InputChangehandle(e.target.value);
            setShowResults(true);
          }}
          className=" w-full h-[48px] px-4 border border-Grey-300 rounded-md text-[15px] text-gray-800 focus:border-primary-500 focus:outline-none"
        />
        {showResults && searchResults?.results?.length ? (
          <ul className=" custom-scrollbar   w-full h-[190px] overflow-y-auto border border-Grey-300 border-t-0 rounded-b-md bg-white z-10">
            {searchResults.results.map((result) => (
              <li
                key={result.id}
                onClick={() => handleSearchResultClick(result)}
                className="px-4 py-3 text-[15px] text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg"
              >
                {result.title || result.name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex space-x-[20px] mt-[16px]">
        {/* 포스터 */}
        {partyInfo.video_name && partyInfo.video_image && (
          <img src={partyInfo.video_image} alt="선택된 포스터" className="w-[250px] h-[360px] rounded-md" />
        )}

        <div className="space-y-[15px]">
          {partyInfo.video_image && partyInfo.media_type === 'tv' && (
            <div>
              <div className="flex">
                <h2>시즌</h2>
                <h2 className="text-purple-600">*</h2>
              </div>
              <CustomSelect options={seasonOptions} value={partyInfo.season_number || ''} onChange={seasonHandle} />
            </div>
          )}
          {partyInfo.video_image && partyInfo.media_type === 'tv' && (
            <div className="space-y-[20px]">
              <div>
                <div className="flex">
                  <h2>회차</h2>
                  <h2 className="text-purple-600">*</h2>
                </div>
                <input
                  type="text"
                  placeholder="시청할 회차를 입력하세요"
                  value={partyInfo.episode_number || ''}
                  onChange={(e) => episodeHandle(e.target.value)}
                  className="px-[16px] py-[12px] h-[48px] w-[249px] rounded-md border-[1px] border-Grey-300 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {partyInfo.video_image && (
            <div>
              <div className="flex">
                <h2>러닝타임</h2>
                <h2 className="text-purple-600">*</h2>
              </div>
              <div className="relative">
                <Image
                  src="/second.svg"
                  alt="User Icon"
                  width={24}
                  height={24}
                  className="absolute right-[10px] top-[30px] transform -translate-y-1/2 pointer-events-none z-10"
                />
                <input
                  type="text"
                  placeholder="분단위로 입력하세요"
                  value={partyInfo.duration_time || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value <= 480) {
                      setPartyInfo((prevState) => ({ ...prevState, duration_time: value }));
                      setError(null); // 오류 메시지 초기화
                    } else {
                      setError('러닝타임은 최대 480분까지 입력 가능합니다');
                    }
                    if (value >= 10) {
                      setError(null);
                    }
                    // else {
                    //   setError('러닝타임은 최소 10분까지 입력 가능합니다');
                    // }
                  }}
                  className="px-[16px] py-[12px] h-[48px] w-[249px] rounded-md border-[1px] border-Grey-300 focus:border-primary-500 focus:outline-none"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
            </div>
          )}
          {/* 플랫폼 */}

          {partyInfo.video_image && partyInfo.video_platform && partyInfo.video_platform.length > 0 ? (
            <div>
              <h2>영상 플랫폼</h2>
              <div className="flex space-x-[4px] mt-2">
                {partyInfo.video_platform.map((platform) => (
                  <div key={platform.name} className="text-center ">
                    <div className="rounded-full border-[1px] border-Grey-200 bg-white p-[3px]">
                      <img src={platform.logoUrl} alt={platform.name} className="w-9 rounded-full " />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            partyInfo.video_image &&
            partyInfo.video_image && (
              <div>
                <h2>영상 플랫폼</h2>
                <p>제공 플랫폼이 존재하지 않습니다.</p>
              </div>
            )
          )}
        </div>
      </div>
      <button
        className={`mt-[32px] w-[520px] ${isNextButtonDisabled ? 'disabled-btn-xl' : 'btn-xl'}`}
        onClick={nextPageHandle}
        disabled={isNextButtonDisabled}
      >
        다음
      </button>
    </div>
  );
};

export default RecruitFirstPage;

// 버튼 컴포넌트 만들기 ***** 컬러. 크기 . 등등 프롭스로 받아서 변경이 쉽게
