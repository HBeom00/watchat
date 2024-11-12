'use client';

import { useRecruitStore } from '../recruitStore';
import { useQueryClient } from '@tanstack/react-query';
import {
  // fetchMultiSearch,
  fetchMovieWatchProvider,
  fetchTvWatchProvider,
  fetchMoviesDetail,
  fetchTvDetail,
  fetchTvEpisode
} from '@/serverActions/TMDB';
import { SearchResult } from '../../../../../types/Search';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/components/recruit/CustomSelect';
import Image from 'next/image';
import SearchComponent from '@/components/recruit/Search';

const RecruitFirstPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const nextPageHandle = () => {
    router.push('/recruit/nextPage');
  };

  const {
    party_name,
    video_name,
    party_detail,
    duration_time,
    media_type,
    video_image,
    episode_number,
    video_platform,
    season_number,
    setPartyInfo
  } = useRecruitStore();

  useEffect(() => {
    //상태 초기화
    if (!video_name) {
      setPartyInfo({
        video_name: '',
        limited_member: 0,
        duration_time: 0,
        video_platform: [],
        video_image: '',
        episode_number: 0,
        season_number: 0
      });

      // 캐시 초기화 재렌더링
      queryClient.refetchQueries({ queryKey: ['searchVideo'] as const });
    }
  }, [video_name, queryClient, setPartyInfo]);

  const fetchProviders = async (id: number, media_type: string) => {
    try {
      const providerData =
        media_type === 'movie' ? await fetchMovieWatchProvider(id) : await fetchTvWatchProvider(id, 1);
      return providerData;
    } catch (error) {
      console.error('플랫폼 정보를 가져오는 중 오류 발생:', error);
    }
  };

  // 검색창 클릭시 정보 들어감
  const handleSearchResultClick = async (result: SearchResult) => {
    const video_id = result.id;
    const media_type = result.media_type;

    //플렛폼 정보 불러오기
    const providerData = await fetchProviders(video_id, media_type);

    //영화/TV 상세 정보 불러오기
    let duration = 0;
    let genre: string[] = [];

    if (media_type === 'movie') {
      const movieDetail = await fetchMoviesDetail(video_id);
      duration = movieDetail?.detail.runtime || 0; // 영화 런타임
      genre = movieDetail?.detail.genres?.map((genre) => genre.name) || []; // 영화 장르
    } else if (media_type === 'tv') {
      const tvDetail = await fetchTvDetail(video_id);
      duration = tvDetail?.detail.episode_run_time[0] || 0; // TV 에피소드 런타임
      genre = tvDetail?.detail.genres?.map((genre) => genre.name) || []; // TV 장르
      console.log(genre);
    }
    setPartyInfo({
      video_name: result.title || result.name || '',
      video_image: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '',
      media_type: result.media_type || '',
      video_id: result.id,
      video_platform: providerData || [],
      popularity: result.popularity,
      backdrop_image: result.backdrop_path,
      duration_time: duration,
      season_number,
      genres: genre
    });
    // setShowResults(false);
    queryClient.invalidateQueries({ queryKey: ['searchVideo'] });
  };

  const seasonOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} 시즌`
  }));

  const seasonHandle = (seasonNum: string | number) => {
    const seasonNumber = typeof seasonNum === 'string' ? Number(seasonNum) : seasonNum;
    setPartyInfo({ season_number: seasonNumber });
  };

  const episodeHandle = async (episodeNum: string) => {
    const episodeNumber = Number(episodeNum);
    const seasonNumber = useRecruitStore.getState().season_number; // 입력한 시즌
    const seriesId = useRecruitStore.getState().video_id; // 영상 아이디

    setPartyInfo({ episode_number: episodeNumber });

    // 회차 없을때 러닝타임 초기화
    if (!episodeNum) {
      setPartyInfo({ duration_time: 0 });
      return;
    }
    // media_type, episodeNumber, seasonNumber, seriesId가 존재할 때만 실행
    if (episodeNumber && seasonNumber && seriesId) {
      const episodeDetail = await fetchTvEpisode(seriesId, seasonNumber, episodeNumber);

      // 런타임이 있을 경우 duration_time에 설정
      if (episodeDetail?.runtime) {
        setPartyInfo({ duration_time: episodeDetail.runtime });
        setError(null); // 오류 메시지 초기화
      } else {
        setError('런타임 정보가 없습니다.');
      }
    }
  };

  // 인풋 값 입력시 버튼 활성화
  const isNextButtonDisabled =
    !party_name || !video_name || !party_detail || (media_type === 'tv' && !episode_number) || !duration_time;

  return (
    <div className="grid place-items-center ">
      <h1 className="text-[28px] font-bold mt-[70px]">파티 모집하기</h1>
      <input
        type="text"
        placeholder="파티 이름"
        value={party_name}
        onChange={(e) => setPartyInfo({ party_name: e.target.value })}
        className="bg-Grey-50 px-[16px] py-[12px] w-[519px] h-[48px] rounded-lg mt-[24px] border border-1 border-Grey-50 focus:border-primary-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="파티에 대해서 소개해주세요."
        value={party_detail}
        onChange={(e) => setPartyInfo({ party_detail: e.target.value })}
        className="mt-[16px] px-[16px] py-[12px] bg-Grey-50 w-[520px] h-[112px] rounded-lg border border-1 border-Grey-50 focus:border-primary-500 focus:outline-none"
      />
      <SearchComponent
        videoName={video_name}
        setVideoName={(name: string) => setPartyInfo({ video_name: name })}
        handleSearchResultClick={handleSearchResultClick}
      />
      <div className="flex space-x-[20px] mt-[16px]">
        {/* 포스터 */}
        {video_name && video_image && (
          <Image src={video_image} alt="선택된 포스터" width={250} height={360} className="rounded-md" />
        )}

        <div className="space-y-[15px]">
          {video_image && media_type === 'tv' && (
            <div>
              <div className="flex">
                <h2>시즌</h2>
                <h2 className="text-purple-600">*</h2>
              </div>
              <CustomSelect options={seasonOptions} value={season_number || ''} onChange={seasonHandle} />
            </div>
          )}
          {video_image && media_type === 'tv' && (
            <div className="space-y-[20px]">
              <div>
                <div className="flex">
                  <h2>회차</h2>
                  <h2 className="text-purple-600">*</h2>
                </div>
                <input
                  type="text"
                  placeholder="시청할 회차를 입력하세요"
                  value={episode_number || ''}
                  onChange={(e) => episodeHandle(e.target.value)}
                  className="px-[16px] py-[12px] h-[48px] w-[249px] rounded-md border-[1px] border-Grey-300 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {video_image && video_image && (
            <div>
              <div className="flex">
                <h2>러닝타임</h2>
                <h2 className="text-purple-600">*</h2>
              </div>
              <div className="relative">
                <Image
                  src="/second.svg" // public 폴더 경로 사용
                  alt="User Icon"
                  width={24}
                  height={24}
                  className="absolute right-[10px] top-[30px] transform -translate-y-1/2 pointer-events-none z-10"
                />
                <input
                  type="text"
                  placeholder="분단위로 입력하세요"
                  value={duration_time || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value <= 480) {
                      setPartyInfo({ duration_time: value });
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

          {video_image && video_platform && video_platform.length > 0 ? (
            <div>
              <h2>영상 플랫폼</h2>
              <div className="flex space-x-[4px] mt-2">
                {video_platform.map((platform) => (
                  <div key={platform.name} className="text-center ">
                    <div className="rounded-full border-[1px] border-Grey-200 bg-white p-[3px]">
                      <Image
                        src={platform.logoUrl}
                        alt={platform.name}
                        width={36}
                        height={36}
                        className=" rounded-full "
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            video_image &&
            video_image && (
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
