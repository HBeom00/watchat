import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const browserClient = createClient();

export default browserClient;

export const getLoginUserIdOnClient = async () => {
  const {
    data: { user },
    error
  } = await browserClient.auth.getUser();

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
