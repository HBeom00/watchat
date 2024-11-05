import Banner from '@/components/home/Banner';
import MyParty from '@/components/home/MyParty';
import RecruitList from '@/components/home/RecruitList';
import { Suspense } from 'react';

const Main = async () => {
  return (
    <Suspense>
      <div className="font-Pretendard">
        <Banner />
        <MyParty />
        <RecruitList />
      </div>
    </Suspense>
  );
};

export default Main;
