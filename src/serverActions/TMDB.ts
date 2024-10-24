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
export const fetchMultiSearch = async (query: string) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=ko-KR&page=1`, options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.error('검색중 오류발생:', err);
    }
};

// 영화 제공 플랫폼
export const fetchMovieWatchProvider = async (movie_id: number) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/watch/providers`, options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.error('영화 플랫폼 정보 가져오기중 오류:', err);
    }
};

// TV 제공 플랫폼
export const fetchTvMovieWatchProvider = async (series_id: number, season_number: number) => {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/${series_id}/season/${season_number}/watch/providers?language=ko-KR`, options);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.error('티비 플랫폼 정보 가져오기중 오류:', err);
    }
};
