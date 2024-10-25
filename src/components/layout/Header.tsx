'use client';

import LogoutButton from '../button/LogoutButton';
import { useUserStore } from '@/providers/userStoreProvider';
import Link from 'next/link';

const Header = () => {
  const { isUser } = useUserStore((state) => state);

  return <div>{isUser ? <LogoutButton /> : <Link href={'/login'}>로그인</Link>}</div>;
};

export default Header;
