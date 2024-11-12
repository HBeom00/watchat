'use client';

import browserClient from '@/utils/supabase/client';

export const getOwnerId = async (roomId: string) => {
  const { data, error } = await browserClient.from('party_info').select('owner_id').eq('party_id', roomId).single();
  if (error) {
    console.error('Error fetching owner ID:', error);
    return '';
  }
  return data?.owner_id;
};
