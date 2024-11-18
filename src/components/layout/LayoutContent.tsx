'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeaderPaths = ['/chat'];
  const hideFooterPaths = ['/login', '/signup', '/recruit', '/my-page/edit', '/chat', '/warming'];

  const showHeader = !hideHeaderPaths.some((path) => pathname.startsWith(path));
  const showFooter = !hideFooterPaths.some((path) => pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header 컴포넌트: 경로와 반응형 조건으로 표시 여부 제어 */}
      {showHeader && (
        <div className="mobile:hidden">
          <Header />
        </div>
      )}

      <main className={showHeader ? 'flex-1 mt-[80px] overflow-auto mobile:mt-0' : 'flex-1 px-[20px] overflow-auto'}>
        {children}
      </main>

      {/* Footer 컴포넌트 */}
      {showFooter && <Footer />}
    </div>
  );
}
