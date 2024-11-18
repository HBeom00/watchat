import { create, createStore } from 'zustand';
import { persist } from 'zustand/middleware';

export type textProp = { searchText: string };

export type searchStore = textProp & { changeSearchWord: (text: string) => void };

const DEFAULT_PROPS: textProp = { searchText: '' };

export const createSearchStateStore = (initState: textProp = DEFAULT_PROPS) => {
  return createStore<searchStore>()((set) => ({
    ...initState,
    changeSearchWord: (text: string) => set(() => ({ searchText: text }))
  }));
};

type VideoInfo = {
  video_name: string;
  video_image: string;
  media_type: string;
  video_id: number | null;
  setVideoInfo: (info: Partial<VideoInfo>) => void;
};

export const useRecruitStore = create(
  persist<VideoInfo>(
    (set) => ({
      video_name: '',
      video_image: '',
      media_type: '',
      video_id: null,
      setVideoInfo: (info) =>
        set((state) => ({
          ...state,
          ...info
        }))
    }),
    { name: 'recruit-storage' }
  )
);
