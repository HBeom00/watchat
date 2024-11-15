import MyOwnerParty from '@/components/mypage/MyOwnerParty';
import MyParticipatingParty from '@/components/mypage/MyParticipatingParty';
import MyProfile from '@/components/mypage/MyProfile';
import React from 'react';

const Page = () => {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* 프로필 영역 */}
      <MyProfile />

      {/* 파티 및 파티원 영역  */}
      <section>
        {/* 참여한 파티 */}
        <MyParticipatingParty />

        {/* 주최한 파티 */}
        <MyOwnerParty />
      </section>
    </div>
  );
};

export default Page;
