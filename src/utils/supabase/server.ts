import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          console.log('error: ', error);
        }
      }
    }
  });
};

export const getIsLogin = async () => {
  const serverClient = createClient();
  const {
    data: { session }
  } = await serverClient.auth.getSession();
  return !!session;
};

export const getLoginUserIdOnServer = async () => {
  const {
    data: { user },
    error
  } = await createClient().auth.getUser();

  // 로그인 상태 확인
  if (!user) {
    console.error('로그인정보가 없습니다.');
    return null; // 사용자 정보가 없으면 null 반환
  }

  if (error) {
    console.error('로그인한 유저 정보를 가져오지 못 했습니다. => ', error);
    return null;
  }

  return user?.id;
};
