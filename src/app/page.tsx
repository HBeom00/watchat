import Banner from '@/components/home/Banner';
import MyParty from '@/components/home/MyParty';
import RecruitList from '@/components/home/RecruitList';

const Main = async () => {
  return (
    <div className="font-pretendard">
      <Banner />
      <MyParty />
      <RecruitList />
    </div>
  );
};

export default Main;
