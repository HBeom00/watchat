'use client';
import { useUserStore } from '@/providers/userStoreProvider';
import browserClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const LogoutButton = () => {
  const { userLogout } = useUserStore((state) => state);
  const router = useRouter();

  const onClickLogoutBtn = async () => {
    await browserClient.auth.signOut();
    userLogout();
    alert('로그아웃 되었습니다.');
    router.push('/login');
  };
  return <button onClick={onClickLogoutBtn}>로그아웃</button>;
};

export default LogoutButton;
