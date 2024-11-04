'use client';

import { useSearchStore } from '@/providers/searchStoreProvider';
import { useUserStore } from '@/providers/userStoreProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWatchFilter } from '@/store/watchFilterStore';
import MyProfileButton from './MyProfileButton';

const Header = () => {
  const { isUser } = useUserStore((state) => state);
  const partySituation = useWatchFilter((state) => state.partySituation);
  const watchFilter = useWatchFilter((state) => state.setPartySituation);
  const searchText = useSearchStore((state) => state.searchText);

  const changeSearchWord = useSearchStore((state) => state.changeSearchWord);
  const pathname = usePathname();
  if (pathname !== '/') {
    changeSearchWord('');
    watchFilter('');
  }

  return (
    <div className="fixed z-50 w-full px-[190px] h-[80px] flex items-center justify-center flex-shrink-0 border-solid border-b-[1px] border-gray-200 bg-white">
      <div className="flex py-4 justify-between items-center flex-[1_0_0] ">
        <div className="flex flex-row items-center gap-6">
          <Link className="flex flex-col py-3 items-start" href={'/'}>
            Watchat
          </Link>
          <div className="flex flex-row h-7 gap-8 items-center text-xl font-bold tracking-[-0.4px]">
            <button
              className={partySituation === '' ? 'text-gray-900' : 'text-gray-400'}
              onClick={() => watchFilter('')}
            >
              전체
            </button>
            <button
              className={partySituation === '시청중' ? 'text-gray-900' : 'text-gray-400'}
              onClick={() => watchFilter('시청중')}
            >
              시청중
            </button>
            <button
              className={partySituation === '모집중' ? 'text-gray-900' : 'text-gray-400'}
              onClick={() => watchFilter('모집중')}
            >
              모집중
            </button>
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 ">
          <div className="flex py-1 px-4 items-center gap-2 rounded-2xl bg-gray-50 w-[250px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.4987 3.43229C5.73727 3.43229 3.4987 5.67087 3.4987 8.43229C3.4987 11.1937 5.73727 13.4323 8.4987 13.4323C11.2601 13.4323 13.4987 11.1937 13.4987 8.43229C13.4987 5.67087 11.2601 3.43229 8.4987 3.43229ZM1.83203 8.43229C1.83203 4.75039 4.8168 1.76562 8.4987 1.76562C12.1806 1.76562 15.1654 4.75039 15.1654 8.43229C15.1654 10.0071 14.6194 11.4543 13.7063 12.595L17.9235 16.8122L16.745 17.9907L12.5111 13.7568C11.3948 14.5993 10.0051 15.099 8.4987 15.099C4.8168 15.099 1.83203 12.1142 1.83203 8.43229Z"
                fill="#757575"
              />
            </svg>
            <input
              type="text"
              className="w-[190px] flex-shrink-0 font-normal text-[14px] leading-[22px] text-gray-500 bg-transparent"
              value={searchText}
              onChange={(e) => changeSearchWord(e.target.value)}
              placeholder="보고싶은 콘텐츠를 검색해보세요"
            />
          </div>
          <div className="flex py-3 px-4 justify-center items-center">
            <Link className="font-semibold text-[15px] leading-6" href={'/recruit/firstPage'}>
              모집하기
            </Link>
          </div>
          <div className="flex py-3 px-4 justify-center items-center">
            {isUser ? (
              <MyProfileButton />
            ) : (
              <Link className="font-semibold text-[15px] leading-6" href={'/login'}>
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
