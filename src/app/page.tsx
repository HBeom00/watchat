// import { createClient } from '@/utils/supabase/server';

// import Banner from '@/components/home/Banner';
import Banner from '@/components/home/Banner';
import RecruitList from '@/components/home/RecruitList';
import { Suspense } from 'react';

const Main = async () => {
  // const { data } = await createClient().auth.getUser();
  // const { data: isUser }: { data: null | string[] } = await createClient().from('user').select('user_id');

  // if (data.user !== null) {
  //   if (isUser?.some((user) => user !== data.user.id)) {
  //     await createClient().from('user').insert({ user_id: data.user.id, user_email: data.user.email });
  //   }
  // }

  return (
    <div>
      <Banner />
      <Suspense fallback={<div>Loading...</div>}>
        <RecruitList />
      </Suspense>
    </div>
  );
};

export default Main;
