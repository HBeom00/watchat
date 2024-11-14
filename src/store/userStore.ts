import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';

export type UserData = {
  nickname: string;
  profile_img: string;
  user_id: string;
  genre: string[];
  platform: string[];
} | null;

export const useFetchUserData = () => {
  return useQuery<UserData, PostgrestError>({
    queryKey: ['userData'],
    queryFn: async () => {
      const userId = await getLoginUserIdOnClient();
      const { data: userData, error }: PostgrestSingleResponse<UserData> = await browserClient
        .from('user')
        .select('profile_img, nickname, user_id, genre, platform')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다. => ', error);
      }
      return userData;
    }
  });
};

// 닉네임 중복검사
export const checkNickname = async (nickname: string) => {
  const { data, error } = await browserClient.from('user').select('nickname').eq('nickname', nickname);
  if (error) {
    return;
  }
  return data && data.length > 0;
};

// nickname으로 user_id를 가져오는 함수
export const fetchUserIdByNickname = async (nickname: string) => {
  console.log('nickname', nickname);
  const { data, error } = await browserClient.from('user').select('user_id').eq('nickname', nickname).single();

  if (error) {
    console.error('이에러 뭐죠', error.message);
  }
  return data?.user_id;
};

// params로 userId가져오기
export const useFetchUserId = () => {
  const params = useSearchParams();
  const userParams = params.get('user');
  const { data: fetchedUserId } = useQuery<string>({
    queryKey: ['userId', userParams],
    queryFn: () => {
      if (userParams) {
        return fetchUserIdByNickname(userParams);
      }
      return '';
    },
    enabled: !!userParams
  });
  return fetchedUserId || '';
};

// 페이지별로 정보를 가져오는 방법을 구분
// 마이페이지 => 패치된 유저 데이터로 가져옴
// 이외 페이지(프로필펭이지) => 닉네임으로 가져온user_id로 데이터를 가져옴
export const useMypageUserData = () => {
  const pathname = usePathname();
  const { data: userData } = useFetchUserData(); // 현재 로그인된 사용자의 데이터
  const fetchedUserId = useFetchUserId();

  // pathname과 현재 로그인 상태로 사용자의 user_id 구분
  const userId = pathname === '/my-page' && userData ? userData.user_id : fetchedUserId;

  const {
    data: myPageUserData,
    isLoading,
    isError
  } = useQuery<UserData>({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (typeof userId === 'string') {
        if (!userData?.user_id) {
          // userId가 닉네임일 경우 user_id를 조회
          //const fetchedUserId = await fetchUserIdByNickname(userId);
          if (userData) {
            const { data, error } = await browserClient.from('user').select('*').eq('user_id', userId).single();
            if (error) throw new Error(`Failed to fetch user data: ${error.message}`);
            return data;
          }
        } else {
          // userId가 user_id일 경우 그대로 데이터를 조회
          const { data, error } = await browserClient.from('user').select('*').eq('user_id', userId).single();
          if (error) throw new Error(`Failed to fetch user data: ${error.message}`);
          return data;
        }
      }
      return null;
    },
    enabled: !!userId // userId가 존재할 때만 실행
  });
  return {
    otherUserData: myPageUserData,
    isLoading,
    isError
  };
};
