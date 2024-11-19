'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const MobileHeader = () => {
  const pathname = usePathname();
  const router = useRouter();

  const hideHeader = !(pathname === '/' || (pathname.startsWith('/search') && pathname !== '/search'));

  const hideBack = pathname === '/recruit/firstPage';
  const hideX = ['/search', '/party', '/my-page', '/warming'].some((n) => pathname.startsWith(n));

  // const menu = pathname==='my-page'

  return (
    <div
      className={`hidden fixed z-40 w-full h-[64px] p-[8px] items-center justify-between bg-static-white
    ${hideHeader && 'mobile:flex'}`}
    >
      <div onClick={() => router.back()} className="flex w-[48px] h-[48px] p-[12px] justify-center items-center">
        {hideBack ? <></> : <Image src={'/arrow_back_black.svg'} width={24} height={24} alt="뒤로가기" />}
      </div>
      <Link href={'/'} className="flex w-[48px] h-[48px] p-[12px] justify-center items-center">
        {hideX ? <></> : <Image src={'/close.svg'} width={24} height={24} alt="뒤로가기" />}
      </Link>
    </div>
  );
};

export default MobileHeader;
