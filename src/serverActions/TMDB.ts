import {SearchResponse} from '../types/Search'

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
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        } // if 부분이 잡히는 애러는 굳이 필요 없지 않을까  (여기서 잡히는 에러가 없지않을까)
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.error('영화 정보 가져오기중 문제발생:', err);
    }
};

// TV 프로그램 정보
export const fetchTvDetail = async (series_id: number) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${series_id}?language=ko-KR`, options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.error('티비 정보 가져오기중 오류발생:', err);
    }
};

// 프로그램 검색
export const fetchMultiSearch = async (query: string): Promise<SearchResponse> => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=ko-KR&page=1`, options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: SearchResponse  = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error('검색중 오류발생:', err);
        throw err;
    }
};

// 영화 제공 플랫폼
export const fetchMovieWatchProvider = async (movie_id: number): Promise<{ name: string, logoUrl: string }[] | null> => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/watch/providers`, options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Movie Provider Data:", data);

        const countryCodes = Object.keys(data.results);
        const targetCountry = data.results.KR || data.results[countryCodes[0]];

        // 항상 배열 또는 null 반환
        if (targetCountry && Array.isArray(targetCountry.flatrate)) {
            return targetCountry.flatrate.map((provider: Provider) => ({
                name: provider.provider_name,
                logoUrl: `https://image.tmdb.org/t/p/w92${provider.logo_path}`
            }));
        } else {
            console.warn("플랫폼 정보가 없습니다.");
            return null;
        }
    } catch (err) {
        console.error('영화 플랫폼 정보 가져오기중 오류:', err);
        return null;
    }
};

// TV 제공 플랫폼
export const fetchTvWatchProvider = async (series_id: number, season_number: number): Promise<{ name: string, logoUrl: string }[] | null> => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}/watch/providers?language=ko-KR`, options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("TV Provider Data:", data);

        const countryCodes = Object.keys(data.results);
        const targetCountry = data.results.KR || data.results[countryCodes[0]];

        if (targetCountry && Array.isArray(targetCountry.flatrate)) {
            return targetCountry.flatrate.map((provider: Provider) => ({
                name: provider.provider_name,
                logoUrl: `https://image.tmdb.org/t/p/w92${provider.logo_path}`
            }));
        } else {
            console.warn("플랫폼 정보가 없습니다.");
            return null;
        }
    } catch (err) {
        console.error('티비 플랫폼 정보 가져오기중 오류:', err);
        return null;
    }
};