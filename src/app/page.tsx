// import { createClient } from '@/utils/supabase/server';

// import Banner from '@/components/home/Banner';
import Banner from '@/components/home/Banner';
import MyParty from '@/components/home/MyParty';
import RecruitList from '@/components/home/RecruitList';
import { getLoginUserIdOnServer } from '@/utils/supabase/server';

const Main = async () => {
  const userId = await getLoginUserIdOnServer();
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
      {userId ? <MyParty userId={userId} /> : <></>}
      <RecruitList />
    </div>
  );
};

export default Main;
