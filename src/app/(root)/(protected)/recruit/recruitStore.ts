import { create } from 'zustand';

interface RecruitState {
  party_name: string;
  video_name: string;
  party_detail: string;
  limited_member: number;
  watch_date: Date | null;
  start_time: Date | null;
  duration_time: number;
  video_platform: { name: string; logoUrl: string }[] | null;
  media_type: string;
  video_image: string;
  backdrop_image: string;
  video_id: number | null;
  episode_number: number;
  situation: string;
  popularity: number | null;
  date_recruitment: Date | null;
  season_number: number | null;
  genres: string[] | null;

  setPartyInfo: (info: Partial<Omit<RecruitState, 'setPartyInfo' | 'setRecruitDetails'>>) => void;
  setRecruitDetails: (details: Partial<Omit<RecruitState, 'setPartyInfo' | 'setRecruitDetails'>>) => void;
}

export const useRecruitStore = create<RecruitState>((set) => ({
  party_name: '',
  video_name: '',
  party_detail: '',
  limited_member: 0,
  watch_date: null,
  start_time: null,
  duration_time: 0,
  video_platform: [],
  media_type: '',
  video_image: '',
  backdrop_image: '',
  video_id: null,
  episode_number: 0,
  situation: '모집중',
  popularity: null,
  date_recruitment: null,
  season_number: null,
  genres: [],

  // 아래 애들이 요청에 들어감
  setPartyInfo: (info) => set((state) => ({ ...state, ...info })),
  setRecruitDetails: (details) => set((state) => ({ ...state, ...details }))
}));

// 쿼리스트링으로 저장 해두면 새로고침해도 데이터 안날라감
