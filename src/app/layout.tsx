import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/providers/queryProvider';
import Header from '@/components/layout/Header';
import { createClient } from '@/utils/supabase/server';
import { UserStoreProvider } from '@/providers/userStoreProvider';
import Footer from '@/components/layout/Footer';
import { SearchProvider } from '@/providers/searchStoreProvider';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '100 200 300 400 500 600 700 800 900',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Wachat',
  description: '함께보면 더 즐거운 watchat'
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
    <html lang="en">
      <body className={`${pretendard.variable} antialiased`}>
        <UserStoreProvider isUser={!!user}>
          <SearchProvider>
            <Providers>
              <Header />
              <main className="flex-grow pt-[80px]">{children}</main>
              <Footer />
            </Providers>
          </SearchProvider>
        </UserStoreProvider>
      </body>
    </html>
  );
}
