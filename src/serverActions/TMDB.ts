import { creditMOVIE, creditTV, videoMOVIE, videoTV } from '@/types/video';
import { SearchResponse } from '../types/Search';

interface Provider {
  provider_name: string;
  logo_path: string;
  provider_id: number;
  display_priority: number;
}

const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiKey}`
  }
};

// 영화 정보
export const fetchMoviesDetail = async (movie_id: number) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?language=ko-KR`, options);
    const data: videoMOVIE = await res.json();
    const credit = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/credits`, options);
    const creditData: creditMOVIE = await credit.json();

    const result = { detail: data, credit: creditData.cast.slice(0, 4) };

    return result;
  } catch (err) {
    console.error('영화 정보 가져오기중 문제발생:', err);
  }
};

// TV 프로그램 정보
export const fetchTvDetail = async (series_id: number) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${series_id}?language=ko-KR`, options);
    const data: videoTV = await res.json();
    const credit = await fetch(`https://api.themoviedb.org/3/tv/${series_id}/aggregate_credits`, options);
    const creditData: creditTV = await credit.json();

    const result = { detail: data, credit: creditData.cast.slice(0, 4) };

    return result;
  } catch (err) {
    console.error('티비 정보 가져오기중 오류발생:', err);
  }
};

// 프로그램 검색
export const fetchMultiSearch = async (query: string): Promise<SearchResponse> => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=ko-KR&page=1`,
      options
    );
    const data: SearchResponse = await res.json();
    return data;
  } catch (err) {
    console.error('검색중 오류발생:', err);
    throw err;
  }
};

// 영화 제공 플랫폼
export const fetchMovieWatchProvider = async (
  movie_id: number
): Promise<{ name: string; logoUrl: string }[] | null> => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/watch/providers`, options); //api 호출
    const data = await res.json();
    const countryCodes = Object.keys(data.results);
    const targetCountry = data.results.KR || data.results[countryCodes[0]];
    // 한국 또는 첫번째 국가의 데이터 가져오기 데이터 (한국 꺼를 먼저 가져오고싶어서)

    // 항상 배열 또는 null 반환
    if (targetCountry && Array.isArray(targetCountry.flatrate)) {
      //flatrate 배열을 순회하며 제공자의 이름과 로고 URL을 추출.
      return targetCountry.flatrate.map((provider: Provider) => ({
        name: provider.provider_name,
        logoUrl: `https://image.tmdb.org/t/p/w92${provider.logo_path}`
      }));
    } else {
      console.warn('플랫폼 정보가 없습니다.');
      return null;
    }
  } catch (err) {
    console.error('영화 플랫폼 정보 가져오기중 오류:', err);
    return null;
  }
};

// TV 제공 플랫폼
export const fetchTvWatchProvider = async (
  series_id: number,
  season_number: number
): Promise<{ name: string; logoUrl: string }[] | null> => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}/watch/providers?language=ko-KR`,
      options
    );
    const data = await res.json();
    const countryCodes = Object.keys(data.results);
    const targetCountry = data.results.KR || data.results[countryCodes[0]];

    if (targetCountry && Array.isArray(targetCountry.flatrate)) {
      return targetCountry.flatrate.map((provider: Provider) => ({
        name: provider.provider_name,
        logoUrl: `https://image.tmdb.org/t/p/w92${provider.logo_path}`
      }));
    } else {
      console.warn('플랫폼 정보가 없습니다.');
      return null;
    }
  } catch (err) {
    console.error('티비 플랫폼 정보 가져오기중 오류:', err);
    return null;
  }
};

// TV 에피소드  PATH params (series_id, season_number, episode_number)

export const fetchTvEpisode = async (
  series_id: number,
  season_number: number,
  episode_number: number
): Promise<{ runtime: number } | null> => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}/episode/${episode_number}?language=ko-KR`,
      options
    );
    const data = await res.json();

    // 에피소드의 런타임이 있는 경우 반환
    if (data && data.runtime) {
      return { runtime: data.runtime };
    } else {
      console.warn('런타임 정보가 없습니다.');
      return null;
    }
  } catch (err) {
    console.error('TV 에피소드 정보 가져오기 중 오류 발생:', err);
    return null;
  }
};
