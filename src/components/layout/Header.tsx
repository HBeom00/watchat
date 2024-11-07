'use client';

// import { useUserStore } from '@/providers/userStoreProvider';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import MyProfileButton from './MyProfileButton';
import GoRecruitButton from './GoRecruitButton';
import { useQuery } from '@tanstack/react-query';
import browserClient from '@/utils/supabase/client';
import SearchBar from './SearchBar';
import { useCallback } from 'react';

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
  const { data: isUser } = useQuery({
    queryKey: ['userId'],
    queryFn: async (): Promise<boolean> => {
      try {
        const { data, error } = await browserClient.auth.getSession();

        if (error) {
          console.error('Error fetching user ID:', error);
          return false; // 에러 발생 시 false 반환
        }

        return data?.session !== null;
      } catch (error) {
        console.error('Unexpected error fetching user ID:', error);
        return false; // 에러 발생 시 false 반환
      }
    },
    initialData: false // 초기값을 false로 설정
  });

  const filter = searchParams.get('watch');

  return (
    <div className=" fixed z-50 w-full h-[80px]  flex items-center justify-center  flex-shrink-0 border-solid border-b-[1px] border-gray-200 bg-white">
      <div className="flex py-4 justify-between items-center flex-[1_0_0] max-w-[1060px] ">
        <div className="flex flex-row items-center gap-6">
          <Link className="flex flex-col py-3 items-start" href={'/'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="142" height="24" viewBox="0 0 142 24" fill="none">
              <g clipPath="url(#clip0_884_26380)">
                <path
                  d="M0 0H7.31L11.64 13.92L15.67 4.04H21.39L25.38 13.85L29.7 0H37.04L29.26 23.93H23.47L18.53 12.58L13.56 23.93H7.78L0 0Z"
                  fill="#7F4AF4"
                />
                <path
                  d="M58.66 12.74H55.71V10.32L62.31 3.5H64.49V7.66H68.82V12.44H64.49V16.94C64.49 18.4 65.13 19.05 66.7 19.05C67.41 19.05 68.17 18.93 69 18.65V23.4C67.56 23.77 66.24 23.96 64.98 23.96C60.74 23.96 58.66 21.94 58.66 17.88V12.74Z"
                  fill="#7F4AF4"
                />
                <path
                  d="M95.16 2.23V8.87C96.3 8 97.74 7.54 99.39 7.54C103.47 7.54 106.17 10.42 106.17 14.8V23.95H100.34V15.36C100.34 13.59 99.36 12.51 97.76 12.51C96.16 12.51 95.15 13.6 95.15 15.36V23.95H89.32V2.23H95.16Z"
                  fill="#7F4AF4"
                />
                <path
                  d="M131.66 12.74H128.71V10.32L135.31 3.5H137.49V7.66H141.82V12.44H137.49V16.94C137.49 18.4 138.13 19.05 139.7 19.05C140.41 19.05 141.17 18.93 142 18.65V23.4C140.56 23.77 139.24 23.96 137.98 23.96C133.74 23.96 131.66 21.94 131.66 17.88V12.74Z"
                  fill="#7F4AF4"
                />
                <path
                  d="M121.58 7.18V9.19C120.24 7.92 118.38 7.18 116.26 7.18C111.66 7.18 108.4 10.62 108.4 15.52C108.4 20.42 111.65 23.86 116.26 23.86C118.38 23.86 120.24 23.12 121.58 21.82V23.93H126.49V7.18H121.58ZM116.31 19.74V18.86C114.44 18.86 113.05 17.52 113.05 15.52C113.05 13.52 114.35 12.18 116.36 12.18C118.37 12.18 119.67 13.5 119.67 15.52C119.67 18.71 116.32 19.74 116.32 19.74H116.31Z"
                  fill="#7F4AF4"
                />
                <path
                  d="M48.53 7.18V9.19C47.19 7.92 45.33 7.18 43.21 7.18C38.61 7.18 35.35 10.62 35.35 15.52C35.35 20.42 38.6 23.86 43.21 23.86C45.33 23.86 47.19 23.12 48.53 21.82V23.93H53.44V7.18H48.53ZM43.3 18.86C41.3 18.86 39.99 17.54 39.99 15.52C39.99 13.5 41.29 12.18 43.3 12.18C45.31 12.18 46.61 13.5 46.61 15.52C46.61 17.54 45.31 18.86 43.3 18.86Z"
                  fill="#7F4AF4"
                />
                <path
                  d="M114.44 15.98C114.716 15.98 114.94 15.7561 114.94 15.48C114.94 15.2039 114.716 14.98 114.44 14.98C114.164 14.98 113.94 15.2039 113.94 15.48C113.94 15.7561 114.164 15.98 114.44 15.98Z"
                  fill="#7F4AF4"
                />
                <path
                  d="M116.38 15.98C116.656 15.98 116.88 15.7561 116.88 15.48C116.88 15.2039 116.656 14.98 116.38 14.98C116.104 14.98 115.88 15.2039 115.88 15.48C115.88 15.7561 116.104 15.98 116.38 15.98Z"
                  fill="#7F4AF4"
                />
                <path
                  d="M118.32 15.98C118.596 15.98 118.82 15.7561 118.82 15.48C118.82 15.2039 118.596 14.98 118.32 14.98C118.044 14.98 117.82 15.2039 117.82 15.48C117.82 15.7561 118.044 15.98 118.32 15.98Z"
                  fill="#7F4AF4"
                />
                <path
                  d="M71.88 15.42C71.88 10.24 75.38 6.84 80.74 6.84C82.49 6.84 84.34 7.22 86.12 7.92V13.04C84.46 12.28 83.06 11.93 81.76 11.93C79.31 11.93 77.87 13.23 77.87 15.43C77.87 17.63 79.34 18.92 81.85 18.92C83.25 18.92 84.75 18.51 86.25 17.78V22.8C84.56 23.59 82.75 24.01 80.87 24.01C75.42 24.01 71.89 20.61 71.89 15.43L71.88 15.42Z"
                  fill="#7F4AF4"
                />
              </g>
              <defs>
                <clipPath id="clip0_884_26380">
                  <rect width="142" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
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
        <div className="flex justify-end items-center gap-2 ">
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
