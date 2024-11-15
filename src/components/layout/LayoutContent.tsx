'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith('/chat');
  const hideFooter = ['/login', '/signup', '/recruit', '/my-page/edit', '/chat', '/warming'];

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <Header />}
      <main
        className={
          !hideHeader ? 'flex-1 mt-[80px] overflow-auto mobile:mt-[58px]' : 'flex-1  px-10 mx-auto overflow-auto'
        }
      >
        {children}
      </main>
      {!hideFooter.some((path) => pathname.startsWith(path)) && <Footer />}
    </div>
  );
}

// flex로 중간 컨텐츠 길이 채우기
