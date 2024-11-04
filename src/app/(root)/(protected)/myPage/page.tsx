import MyParticipatingParty from '@/components/mypage/MyParticipatingParty';
import MyProfile from '@/components/mypage/MyProfile';
import MyOwnerParty from '@/components/mypage/MyOwnerParty';
import MyInvitedParty from '@/components/mypage/MyInvitedParty';
import MyFollowRecommendation from '@/components/mypage/MyFollowRecommendation';

const MyPage = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* 프로필 영역 */}
      <MyProfile />

      {/* 파티 및 파티원 영역  */}
      <section>
        {/* 참여한 파티 */}
        <MyParticipatingParty />

        {/* 주최한 파티 */}
        <MyOwnerParty />

        {/* 초대받은 파티 */}
        <MyInvitedParty />

        {/* 팔로우 추천 */}
        <MyFollowRecommendation />
      </section>
    </div>
  );
};

export default MyPage;
