'use client';

// import { useUserStore } from '@/providers/userStoreProvider';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import MyProfileButton from './MyProfileButton';
import GoRecruitButton from './GoRecruitButton';
import SearchBar from './SearchBar';
import { useCallback } from 'react';
import { useUserId } from '@/reactQuery/useQuery/chat/useUserId';
import Image from 'next/image';

const Header = () => {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // 유저 ID 가져오기
  const { data: isUser } = useUserId();

  const filter = searchParams.get('watch');

  return (
    <div className=" mobile:h-[58px] fixed z-50 w-full h-[80px]  flex items-center justify-center  flex-shrink-0 border-solid border-b-[1px] border-gray-200 bg-white">
      <div className="flex py-4 justify-between items-center flex-[1_0_0] max-w-[1060px] ">
        <div className="flex flex-row items-center gap-6">
          <Link className="flex flex-col py-3 items-start" href={'/'}>
            <Image src={'/logo.svg'} width={142} height={24} alt="watchat 로고" />
          </Link>
          <div className="flex flex-row h-7 gap-8 items-center text-xl font-bold tracking-[-0.4px]">
            <Link
              href={'/?' + createQueryString('watch', '')}
              className={filter === '' || filter === null ? 'text-gray-900' : 'text-gray-400'}
            >
              전체
            </Link>
            <Link
              href={'/?' + createQueryString('watch', 'current')}
              className={filter === 'current' ? 'text-gray-900' : 'text-gray-400'}
            >
              시청중
            </Link>
            <Link
              href={'/?' + createQueryString('watch', 'recruiting')}
              className={filter === 'recruiting' ? 'text-gray-900' : 'text-gray-400'}
            >
              모집중
            </Link>
          </div>
        </div>
        <div className="flex justify-end items-center gap-2">
          <SearchBar />
          <div className="flex py-3 px-4 justify-center items-center">
            <GoRecruitButton isLogin={isUser} />
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
