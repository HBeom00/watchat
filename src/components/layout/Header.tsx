'use client';

import LogoutButton from '../button/LogoutButton';
import { useUserStore } from '@/providers/userStoreProvider';
import Link from 'next/link';

const Header = () => {
  const { isUser } = useUserStore((state) => state);

  return( 
<>
    <h1>Watchat</h1>
    <button>전체</button>
    <button>시청중</button>
    <button>모집중</button>
    <input 
    type="text"
    placeholder='보고 싶은 콘텐츠를 검색해보세요'
    />
    <Link href={'/recruit/firstPage'}></Link>
    <div>{isUser ? <LogoutButton /> : <Link href={'/login'}>로그인</Link>}</div>
</>
  )
};

export default Header;
