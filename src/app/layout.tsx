// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/queryProvider';
import { createClient } from '@/utils/supabase/server';
import { UserStoreProvider } from '@/providers/userStoreProvider';
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

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    data: { user }
  } = await createClient().auth.getUser();

  return (
    <html lang="ko">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, minimum-scale=1"></meta>
      <body className={`antialiased`}>
        <UserStoreProvider isUser={!!user}>
          <Providers>
            <LayoutContent>{children}</LayoutContent>
          </Providers>
        </UserStoreProvider>
      </body>
    </html>
  );
}
