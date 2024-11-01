import { create } from 'zustand';

type RecruitState = {
  partySituation: string;

  setPartySituation: (info: string) => void;
};

export const useWatchFilter = create<RecruitState>((set) => ({
  partySituation: '',

  setPartySituation: (info) => set(() => ({ partySituation: info }))
}));
