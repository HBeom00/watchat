'use client';

import browserClient from '@/utils/supabase/client';

export const getPartyMemberList = async (roomId: string) => {
  const { data, error } = await browserClient.from('team_user_profile').select().eq('party_id', roomId);
  if (error) {
    console.error('Error fetching members:', error);
    return [];
  }
  return data;
};
