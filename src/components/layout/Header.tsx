'use client';

import LogoutButton from '../button/LogoutButton';
import { useUserStore } from '@/providers/userStoreProvider';
import Link from 'next/link';

const Header = () => {
  const { isUser } = useUserStore((state) => state);

  return( 
<div className='flex space-x-[50%] ml-[10%] items-center h-[80px]'>
    <div className='flex space-x-[25px]'>
     <h1>Watchat</h1>
     <button>전체</button>
     <button>시청중</button>
     <button>모집중</button>
    </div>
    <div className='flex space-x-[25px]'>
     <input 
     type="text"
     placeholder='보고 싶은 콘텐츠를 검색해보세요'
     className='w-[250px]'
     />
     <Link href={'/recruit/firstPage'}>모집하기</Link>
     <div>{isUser ? <LogoutButton /> : <Link href={'/login'}>로그인</Link>}</div>
    </div>
</div>
  )
};

export default Header;
