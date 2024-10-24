import { getLoginUserId } from '@/utils/getUserId';
import browserClient from '@/utils/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { create } from 'zustand';

type UserStore = {
  userData: UserData;
  error: PostgrestError | null;
  fetchUserData: () => Promise<void>;
  setUserData: (data: UserData) => void;
};

type UserData = {
  nickname: string;
  profile_img: string;
} | null;

// 로그인한 사용자 정보를 불러오는 함수
export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  error: null,
  fetchUserData: async () => {
    const userId = await getLoginUserId();
    const { data: userData, error } = await browserClient
      .from('user')
      .select('profile_img, nickname')
      .eq('user_id', userId)
      .single();

    if (userData) {
      set({ userData, error: null });
    }
    if (error) {
      set({ error, userData: null });
      console.error('사용자 정보를 불러오는데 실패했습니다. => ', error);
    }
  },
  setUserData: (data: UserData) => set({ userData: data })
}));
