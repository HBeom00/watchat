import { createClient } from '@/utils/supabase/server';

const Main = async () => {
  const { data } = await createClient().auth.getUser();
  const { data: isUser }: { data: null | string[] } = await createClient().from('user').select('user_id');

  if (data.user !== null) {
    if (isUser?.some((user) => user !== data.user.id)) {
      await createClient().from('user').insert({ user_id: data.user.id, user_email: data.user.email });
    }
  }

  return <div>메인 페이지</div>;
};

export default Main;
