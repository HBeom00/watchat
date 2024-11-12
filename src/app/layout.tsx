// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/queryProvider';
import LayoutContent from '@/components/layout/LayoutContent';

export const metadata: Metadata = {
  title: 'Watchat | 왓챗 ',
  description: '여럿이 보면 더 즐거우니까! 영상메이트가 필요할 땐 watchat',
  icons: {
    icon: '/favicon.svg'
  },
  openGraph: {
    title: 'Watchat | 왓챗 ',
    description: '여럿이 보면 더 즐거우니까! 영상메이트가 필요할 땐 watchat',
    url: 'https://watchat.vercel.app/',
    images: [
      {
        url: '/open_graph.png',
        width: 800,
        height: 400,
        alt: 'Watchat'
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`antialiased`}>
        <Providers>
          <LayoutContent>{children}</LayoutContent>
        </Providers>
      </body>
    </html>
  );
}
