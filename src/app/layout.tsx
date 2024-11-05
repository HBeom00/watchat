// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/queryProvider';
import { createClient } from '@/utils/supabase/server';
import { UserStoreProvider } from '@/providers/userStoreProvider';
import { SearchProvider } from '@/providers/searchStoreProvider';
import LayoutContent from '@/components/layout/LayoutContent';

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
    <html lang="ko">
      <body className={`antialiased`}>
        <UserStoreProvider isUser={!!user}>
          <SearchProvider>
            <Providers>
              <LayoutContent>{children}</LayoutContent>
            </Providers>
          </SearchProvider>
        </UserStoreProvider>
      </body>
    </html>
  );
}
