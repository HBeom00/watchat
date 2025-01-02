import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from '../supabase/client';

type banUser = {
  id: string;
  party_id: string;
  user_id: string;
};

const getBanUsers = async (party_id: string) => {
  const response: PostgrestSingleResponse<banUser[]> = await browserClient
    .from('party_ban_user')
    .select('*')
    .eq('party_id', party_id);
  if (response.error || response.data.length === 0) {
    return [];
  }
  return response.data;
};
export default getBanUsers;
