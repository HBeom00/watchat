 export interface SearchResult {
    id: number;
    title?: string; // 영화 제목
    name?: string;  // TV 프로그램 제목 또는 사람 이름
    media_type: 'movie' | 'tv' | 'person'; // 미디어 타입
    poster_path?: string; // 포스터 이미지 경로
    overview?: string; // 설명
  }
  
 export interface SearchResponse {
    page: number;
    results: SearchResult[];
    total_results: number;
    total_pages: number;
  }


  