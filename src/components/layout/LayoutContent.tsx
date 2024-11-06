'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // /chat, /login, /signup 경로에서 Footer 숨기기
  const hideHeaderFooter = pathname.startsWith('/chat');
  const hideFooter =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/recruit') ||
    pathname.startsWith('/myPage/edit') ||
    hideHeaderFooter;
  // className="flex-grow pt-[80px]"
  return (
    <div className="flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className={!hideHeaderFooter ? ' mt-[80px] overflow-auto' : '  px-10 mx-auto overflow-auto'}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
// 모집 페이지에 Footer, 기본 정보 기입 페이지
