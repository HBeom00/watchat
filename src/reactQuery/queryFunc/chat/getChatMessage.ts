'use client';

import browserClient from '@/utils/supabase/client';

export const getChatMessage = async (roomId: string) => {
  const { data, error } = await browserClient
    .from('chat')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data;
};
