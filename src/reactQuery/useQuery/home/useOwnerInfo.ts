// 멤버 수 확인하기

import { useQuery } from '@tanstack/react-query';
import browserClient from '../../../utils/supabase/client';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { member } from '@/types/partyMember';
import { partyInfo } from '@/types/partyInfo';

export const useOwnerInfo = (data: partyInfo) => {
  return useQuery({
    queryKey: ['partyOwnerInfo', data.party_id],
    queryFn: async () => {
      const response: PostgrestSingleResponse<member> = await browserClient
        .from('team_user_profile')
        .select('*')
        .eq('user_id', data.owner_id)
        .eq('party_id', data.party_id)
        .single();
      return response.data;
    }
  });
};
