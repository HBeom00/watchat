'use client';

import browserClient from '@/utils/supabase/client';

export const getUserId = async (): Promise<boolean> => {
  try {
    const { data, error } = await browserClient.auth.getSession();

    if (error) {
      console.error('Error fetching user ID:', error);
      return false; // 에러 발생 시 false 반환
    }

    return data?.session !== null;
  } catch (error) {
    console.error('Unexpected error fetching user ID:', error);
    return false; // 에러 발생 시 false 반환
  }
};
