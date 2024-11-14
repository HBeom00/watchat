'use client';

import browserClient from '@/utils/supabase/client';

export const getPartyMemberList = async (roomId: string) => {
  const { data: userData, error: userDateError } = await browserClient
    .from('team_user_profile')
    .select()
    .eq('party_id', roomId);

  if (userDateError) {
    console.error('Error fetching messages:', userDateError);
    return [];
  }
  return userData;
};
