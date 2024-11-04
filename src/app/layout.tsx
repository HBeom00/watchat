import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/queryProvider';
import Header from '@/components/layout/Header';
import { createClient } from '@/utils/supabase/server';
import { UserStoreProvider } from '@/providers/userStoreProvider';
import Footer from '@/components/layout/Footer';
import { SearchProvider } from '@/providers/searchStoreProvider';

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
      <body className={`antialiased`}>
        <UserStoreProvider isUser={!!user}>
          <SearchProvider>
            <Providers>
              <Header />
              <main className="flex-grow pt-[80px] max-w-[1060px] mx-auto">{children}</main>
              <Footer />
            </Providers>
          </SearchProvider>
        </UserStoreProvider>
      </body>
    </html>
  );
}
