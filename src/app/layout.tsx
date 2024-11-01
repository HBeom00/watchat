import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import Providers from '@/providers/queryProvider';

import Header from '@/components/layout/Header';
import { createClient } from '@/utils/supabase/server';
import { UserStoreProvider } from '@/providers/userStoreProvider';
import Footer from '@/components/layout/Footer';
import { SearchProvider } from '@/providers/searchStoreProvider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UserStoreProvider isUser={!!user}>
          <SearchProvider>
            <Providers>
              <Header />
              <main className="flex-grow pt-[80px] px-[190px]">{children}</main>
              <Footer />
            </Providers>
          </SearchProvider>
        </UserStoreProvider>
      </body>
    </html>
  );
}
