import Banner from '@/components/home/Banner';
import MyParty from '@/components/home/MyParty';
import RecruitList from '@/components/home/RecruitList';

const Main = async () => {
  return (
    <div className="w-[1060px] m-auto mobile:w-[375px] mobile:px-[20px]">
      <Banner />
      <MyParty />
      <RecruitList />
    </div>
  );
};

export default Main;
