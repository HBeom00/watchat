'use client';

import Link from 'next/link';
import MyProfileButton from './MyProfileButton';
import GoRecruitButton from './GoRecruitButton';
import SearchBar from './SearchBar';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const HeaderMobileBottom = ({ isUser }: { isUser: boolean }) => {
  const pathname = usePathname();

  const select = (path: string) => {
    if ((path === '/' && pathname === path) || (path !== '/' && pathname.startsWith(path))) {
      return 'text-primary-400';
    } else {
      return 'text-Grey-300';
    }
  };

  return (
    <div
      className={`flex justify-end items-center gap-2 bg-static-white 
  mobile:fixed mobile:z-40 mobile:bottom-0 mobile:px-[20px] mobile:justify-between mobile:shadow-2xl mobile:body-xs-bold mobile:w-full`}
    >
      <Link href={'/'} className={`hidden p-[8px] justify-center items-center mobile:flex`}>
        <div className="flex flex-col w-[56px] items-center">
          <Image
            src={`/headerIcon/${pathname === '/' ? 'house_select' : 'house'}.svg`}
            width={24}
            height={24}
            alt="홈"
          />
          <p className={`self-stretch text-center ${select('/')}`}>홈</p>
        </div>
      </Link>
      <Link href={'/search'} className={`hidden p-[8px] justify-center items-center mobile:flex`}>
        <div className="flex flex-col w-[56px] items-center">
          <Image
            src={`/headerIcon/${pathname.startsWith('/search') ? 'search_select' : 'search'}.svg`}
            width={24}
            height={24}
            alt="검색"
          />
          <p className={`self-stretch text-center ${select('/search')}`}>검색</p>
        </div>
      </Link>
      <SearchBar />
      <div
        className={`flex py-[12px] px-[16px] justify-center items-center
        mobile:p-[8px] mobile:w-[72px]`}
      >
        <GoRecruitButton isLogin={isUser} />
      </div>
      <div
        className={`flex py-[12px] px-[16px] justify-center items-center
        mobile:p-[8px] mobile:w-[72px]`}
      >
        {isUser ? (
          <>
            <MyProfileButton />
            <Link
              className={`hidden
              mobile:flex`}
              href={'/my-page'}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex flex-col p-[3px] w-[24px] h-[24px] gap-[1px] justify-center items-center flex-shrink-0`}
                >
                  <Image
                    src={`/headerIcon/${pathname.startsWith('/my-page') ? 'loginH_select' : 'loginH'}.svg`}
                    width={9}
                    height={9}
                    alt="마이페이지"
                  />
                  <Image
                    src={`/headerIcon/${pathname.startsWith('/my-page') ? 'loginB_select' : 'loginB'}.svg`}
                    width={18}
                    height={8}
                    alt="마이페이지"
                  />
                </div>
                <p className={`body-xs-bold text-center ${select('/my-page')}`}>마이페이지</p>
              </div>
            </Link>
          </>
        ) : (
          <Link href={'/login'}>
            <div className="flex flex-col w-[56px] items-center">
              <div
                className={`hidden flex-col p-[3px] w-[24px] h-[24px] gap-[1px] justify-center items-center flex-shrink-0
                mobile:flex`}
              >
                <Image src={'/headerIcon/loginH.svg'} width={9} height={9} alt="로그인" />
                <Image src={'/headerIcon/loginB.svg'} width={18} height={8} alt="로그인" />
              </div>
              <p
                className={`body-m-bold text-Grey-900 text-center
                mobile:text-Grey-300 mobile:body-xs-bold`}
              >
                로그인
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeaderMobileBottom;
