export type SearchResult = {
  id: number;
  title?: string; // 영화 제목
  name?: string; // TV 프로그램 제목 또는 사람 이름
  media_type: 'movie' | 'tv' | 'person'; // 미디어 타입
  poster_path?: string; // 포스터 이미지 경로
  overview?: string; // 설명
  backdrop_path?: string;
  platform: { name: string; logoUrl: string }[];
  popularity: number;
  genres: { name: string }[];
  release_date: Date;
  first_air_date: Date;
};

export type SearchResponse = {
  results: SearchResult[];
};

export type Genre = {
  id: number;
  name: string;
};

export type SearchProps = {
  videoName: string;
  setVideoName: (name: string) => void;
  handleSearchResultClick: (result: SearchResult) => void;
};

export type Search = {
  videoName: string;
  setVideoName: (name: string) => void;
};

export type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (result: SearchResult) => void;
  videoName: string;
  setVideoName: (name: string) => void;
};
