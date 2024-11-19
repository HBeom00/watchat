import { createStore } from 'zustand';

export type textProp = { searchText: string };

export type searchStore = textProp & { changeSearchWord: (text: string) => void };

const DEFAULT_PROPS: textProp = { searchText: '' };

export const createSearchStateStore = (initState: textProp = DEFAULT_PROPS) => {
  return createStore<searchStore>()((set) => ({
    ...initState,
    changeSearchWord: (text: string) => set(() => ({ searchText: text }))
  }));
};

export type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (result: SearchResult) => void;
  videoName: string;
  setVideoName: (name: string) => void;
}