'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname.startsWith('/chat');
  const hideFooter = ['/login', '/signup', '/recruit', '/myPage/edit', '/chat', '/warming'];

  return (
    <div className="flex flex-col">
      {!hideHeader && <Header />}
      <main
        className={
          !hideHeader ? ' mt-[80px] overflow-auto mobile:mt-[58px]' : ' px-10 mx-auto overflow-auto'
        }
      >
        {children}
      </main>
      {!hideFooter.some((path) => pathname.startsWith(path)) && <Footer />}
    </div>
  );
}

// flex로 중간 컨텐츠 길이 채우기
