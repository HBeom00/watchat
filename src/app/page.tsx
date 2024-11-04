import Banner from '@/components/home/Banner';
import MyParty from '@/components/home/MyParty';
import RecruitList from '@/components/home/RecruitList';
import { getLoginUserIdOnServer } from '@/utils/supabase/server';


const Main = async () => {
  const userId = await getLoginUserIdOnServer();

  return (
    <div className="font-pretendard">
      <Banner />
      {userId ? <MyParty userId={userId} /> : <></>}
      <RecruitList />
    </div>
  );
};

export default Main;
