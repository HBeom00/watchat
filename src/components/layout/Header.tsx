'use client';

import Link from 'next/link';
import { useUserId } from '@/reactQuery/useQuery/chat/useUserId';
import Image from 'next/image';
import RecruitFilter from './RecruitFilter';
import HeaderMobileBottom from './HeaderMobileBottom';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  // 유저 ID 가져오기
  const { data: isUser } = useUserId();

  return (
    <div
      className={`fixed z-40 w-full h-[80px] flex items-center justify-center flex-shrink-0 border-solid border-b-[1px] border-Grey-200 bg-static-white
    mobile:h-[58px] ${
      !(pathname === '/' || pathname.startsWith('/search') || pathname.startsWith('/my-page')) && 'mobile:hidden'
    }`}
    >
      <div
        className={`flex flex-row py-4 justify-between items-center flex-[1_0_0] max-w-[1060px] 
        mobile:flex-col mobile:p-0`}
      >
        <div
          className={`flex flex-row items-center gap-[24px]
          mobile:px-[20px] mobile:w-[375px] mobile:justify-between mobile:self-stretch  ${
            pathname.startsWith('/my-page') && 'mobile:hidden'
          }`}
        >
          <Link className="flex py-3 items-start" href={'/'}>
            <Image
              src={'/logo.svg'}
              width={142}
              height={24}
              className="mobile:w-[118px] mobile:h-[20px]"
              alt="watchat 로고"
            />
          </Link>
          <RecruitFilter />
        </div>
        <HeaderMobileBottom isUser={isUser} />
      </div>
    </div>
  );
};

export default Header;
