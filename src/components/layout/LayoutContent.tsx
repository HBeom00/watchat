'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // /chat, /login, /signup 경로에서 Footer 숨기기
  const hideHeaderFooter = pathname.startsWith('/chat');
  const hideFooter = pathname.startsWith('/login') || pathname.startsWith('/signup') || hideHeaderFooter;
  // className="flex-grow pt-[80px]"
  return (
    <div className="flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main
        className={
          !hideHeaderFooter
            ? 'max-w-[1140px] mx-auto px-10 mt-[80px] overflow-auto'
            : 'max-w-[1140px]  px-10 mx-auto overflow-auto'
        }
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
// 모집 페이지에 Footer, 기본 정보 기입 페이지
