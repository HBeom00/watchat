'use client';

import { useSearchStore } from '@/providers/searchStoreProvider';
import LogoutButton from '../button/LogoutButton';
import { useUserStore } from '@/providers/userStoreProvider';
import Link from 'next/link';

const Header = () => {
  const { isUser } = useUserStore((state) => state);
  const searchText = useSearchStore((state) => state.searchText);
  const changeSearchWord = useSearchStore((state) => state.changeSearchWord);

  return (
    <div className="fixed z-50 w-full flex space-x-[50%] p-10 items-center h-[80px] bg-white">
      <div className="flex space-x-[25px]">
        <Link href={'/'}>Watchat</Link>
        <button>전체</button>
        <button>시청중</button>
        <button>모집중</button>
      </div>
      <div className="flex space-x-[25px]">
        <input
          type="text"
          value={searchText}
          onChange={(e) => changeSearchWord(e.target.value)}
          placeholder="보고 싶은 콘텐츠를 검색해보세요"
          className="w-[250px]"
        />
        <Link href={'/recruit/firstPage'}>모집하기</Link>
        <div>{isUser ? <LogoutButton /> : <Link href={'/login'}>로그인</Link>}</div>
      </div>
    </div>
  );
};

export default Header;
