import Link from 'next/link';
import React from 'react';
import MyProfileButton from './MyProfileButton';
import GoRecruitButton from './GoRecruitButton';
import SearchBar from './SearchBar';
import Image from 'next/image';

const HeaderMobileBottom = ({ isUser }: { isUser: boolean }) => {
  return (
    <div
      className={`flex justify-end items-center gap-2 bg-static-white 
  mobile:fixed mobile:bottom-0 mobile:px-[20px] mobile:justify-between mobile:shadow-2xl mobile:body-xs-bold mobile:w-full`}
    >
      <Link href={'/'} className={`hidden p-[8px] justify-center items-center mobile:flex`}>
        <div className="flex flex-col w-[56px] items-center">
          <Image src={'/headerIcon/house.svg'} width={24} height={24} alt="홈" />
          <p className="self-stretch text-center text-primary-400">홈</p>
        </div>
      </Link>
      <Link href={'/search'} className={`hidden p-[8px] justify-center items-center mobile:flex`}>
        <div className="flex flex-col w-[56px] items-center">
          <Image src={'/headerIcon/search.svg'} width={24} height={24} alt="홈" />
          <p className="self-stretch text-center text-Grey-300">검색</p>
        </div>
      </Link>
      <SearchBar />
      <div
        className={`flex py-[12px] px-[16px] justify-center items-center
        mobile:p-[8px]`}
      >
        <GoRecruitButton isLogin={isUser} />
      </div>
      <div
        className={`flex py-[12px] px-[16px] justify-center items-center
        mobile:p-[8px]`}
      >
        {isUser ? (
          <MyProfileButton />
        ) : (
          <Link href={'/login'}>
            <div className="flex flex-col w-[56px] items-center">
              <div
                className={`hidden flex-col p-[3px] w-[24px] h-[24px] gap-[1px] justify-center items-center flex-shrink-0
                mobile:flex`}
              >
                <Image src={'/headerIcon/loginH.svg'} width={9} height={9} alt="홈" />
                <Image src={'/headerIcon/loginB.svg'} width={18} height={8} alt="홈" />
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
