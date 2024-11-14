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
  console.log('dddddddddddd', data);
  return data?.user_id;
};

// 페이지별로 정보를 가져오는 방법을 구분
// 마이페이지 => 패치된 유저 데이터로 가져옴
// 이외 페이지(프로필펭이지) => 닉네임으로 가져온user_id로 데이터를 가져옴
export const useMypageUserData = () => {
  const pathname = usePathname();
  const { data: userData } = useFetchUserData();
  const params = useSearchParams();

  // nickname을 쿼리 스트링에서 가져오기
  const userNickname = params.get('user');

  // 마이페이지인 경우 userData에서 user_id 가져오기 아닌경우 nickname을 가져옴
  const userId = pathname === '/my-page' && userData ? userData?.user_id : userNickname;

  console.log('유저아이ㅇ디', userId);

  // 다른 사용자의 프로필 페이지인 경우 nickname으로 user_id를 가져옴
  const {
    data: myPageUserData,
    isLoading: userLoading,
    isError: userError
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      // userId가 nickname일 경우
      if (typeof userId === 'string' && !userData?.user_id) {
        const fetchedUserId = await fetchUserIdByNickname(userId); // nickname으로 user_id를 먼저 가져옵니다.
        if (fetchedUserId) {
          return await browserClient.from('user').select('*').eq('user_id', fetchedUserId).single(); // 해당 user_id로 사용자 데이터 가져오기
        }
        return null; // user_id가 없으면 null 반환
      }

      // userId가 user_id일 경우
      const { data, error } = await browserClient.from('user').select('*').eq('user_id', userId).single(); // user_id로 사용자 데이터 가져오기

      if (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다. => ', error);
      }

      return data;
    },
    enabled: !!userId // userId가 있을 때만 쿼리를 실행
  });
  console.log('ddddgggggggggg', myPageUserData);

  return {
    otheruserData: myPageUserData,
    userLoading,
    userError
  };
};
