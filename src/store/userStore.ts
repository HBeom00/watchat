import { getLoginUserId } from '@/utils/getUserId';
import browserClient from '@/utils/supabase/client';
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

type UserData = {
  nickname: string;
  profile_img: string;
  user_id: string;
} | null;

export const useFetchUserData = () => {
  return useQuery<UserData, PostgrestError>({
    queryKey: ['userData'],
    queryFn: async () => {
      const userId = await getLoginUserId();
      const { data: userData, error }: PostgrestSingleResponse<UserData> = await browserClient
        .from('user')
        .select('profile_img, nickname, user_id')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다. => ', error);
      }
      return userData;
    }
  });
};