import browserClient from './supabase/client';

export const memberExpulsion = async (member_Id: string, party_id: string) => {
  const { error } = await browserClient
    .from('team_user_profile')
    .delete()
    .eq('profile_id', member_Id)
    .eq('party_id', party_id);

  if (error) {
    console.log(error.message);
  }
};
