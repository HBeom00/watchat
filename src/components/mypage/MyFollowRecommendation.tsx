'use client';

import { banUser } from '@/utils/myPage/banUser';
import { follow } from '@/utils/myPage/followUnfollow';
import { usePrevNextButtons } from '@/utils/myPage/useMypageCarouselButton';
import { useRecommendedUsers } from '@/utils/myPage/useRecommendedUser';
import { useFetchUserData } from '@/store/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import closeBte from '../../../public/close.svg';
import doesntExist from '../../../public/nobody.svg';
import Link from 'next/link';
import { MyCarousel } from './MyCarousel';
import { RecentParticipantsData } from '@/utils/myPage/getRecommendedUser';
import { cutVideoName } from '@/utils/cutNameAndPartyName';
import ComponentLoading from './ComponentLoading';

const MyFollowRecommendation = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start'
  });

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  const queryClient = useQueryClient();

  // 팔로우 추천 목록 가져오기
  const {
    data: recommendedUsers,
    isPending: pendingRecommendedUsers,
    isError: errorRecommenedUsers
  } = useRecommendedUsers(userId as string);

  // 팔로우 하기
  const followMutation = useMutation({
    mutationFn: (followId: string) => follow(userId as string, followId),
    onSuccess: (data, followId) => {
      // 추천 사용자 목록에서 이미 팔로우한 유저 제거
      queryClient.setQueryData<RecentParticipantsData[]>(['recommendedUser', userId], (oldData) => {
        if (!oldData) return [];

        const updatedData = oldData.map((party) => ({
          ...party,
          team_user_profile: party.team_user_profile.filter((profile) => profile.user.user_id !== followId)
        }));

        // 팔로우한 유저가 모두 삭제되었을 경우 추천 목록을 빈 배열로 처리
        if (updatedData.every((party) => party.team_user_profile.length === 0)) {
          queryClient.setQueryData(['recommendedUser', userId], []);
        }

        return updatedData;
      });

      // 팔로잉 유저 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['followingUsers', userId] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUser', userId] });
    }
  });

  //  X 버튼을 누르면 해당 유저를 추천 목록에서 밴시킴
  const banMutation = useMutation({
    mutationFn: (bannedUserId: string) => banUser(userId as string, bannedUserId),
    onSuccess: (arr, bannedUserId) => {
      // 차단 후 추천 목록 업데이트
      queryClient.setQueryData<RecentParticipantsData[]>(['recommendedUser', userId], (oldData) => {
        if (!oldData) return [];
        const updatedData = oldData.map((party) => ({
          ...party,
          team_user_profile: party.team_user_profile.filter((profile) => profile.user.user_id !== bannedUserId)
        }));

        // 차단 후 추천 목록이 비었을 경우 빈 배열로 처리
        if (updatedData.every((party) => party.team_user_profile.length === 0)) {
          queryClient.setQueryData(['recommendedUser', userId], []);
        }

        return updatedData;
      });
      queryClient.invalidateQueries({ queryKey: ['recommendedUser', userId] });
    },
    onError: (error) => {
      console.error('차단에 실패했습니다:', error);
    }
  });

  if (isPending || pendingRecommendedUsers) {
    return (
      <div className="w-[1060px] mx-auto flex flex-col m-full mb-4 h-[320px] mobile:px-[20px]  mobile:h-[350px] mobile:w-full">
        <div>
          <h3 className="title-m">팔로우 추천</h3>
        </div>
        <li className="py-20 flex flex-col justify-center items-center m-auto gap-2">
          <ComponentLoading />
          <p className="body-m text-Grey-600 mt-[20px]">데이터를 불러오는 중 입니다.</p>
        </li>
      </div>
    );
  }
  if (isError || errorRecommenedUsers) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article className=" m-auto mb-[85px] w-[1060px] mobile:w-full">
      <div className="flex justify-between m-auto mb-4  mobile:px-[20px]">
        <h3 className="title-m">팔로우 추천</h3>
      </div>

      {/* 캐러셀 컨테이너 */}
      <div className="relative  mobile:pl-[20px]">
        {recommendedUsers && recommendedUsers.length > 6 && (
          // 캐러셀 버튼
          <MyCarousel
            emblaRef={emblaRef}
            prevBtnDisabled={prevBtnDisabled}
            nextBtnDisabled={nextBtnDisabled}
            onPrevButtonClick={onPrevButtonClick}
            onNextButtonClick={onNextButtonClick}
          />
        )}
        <div ref={emblaRef} className="overflow-hidden w-full max-w-[1060px]">
          <ul className="carousel-container flex items-center">
            {recommendedUsers && recommendedUsers.length > 0 ? (
              recommendedUsers.map((recommendedUser) => {
                // 영상 제목 및 에피소드
                const videoNameWithEpisode = `${recommendedUser.video_name} ${
                  recommendedUser.media_type === 'tv' && recommendedUser.episode_number
                    ? `${recommendedUser.episode_number} 화`
                    : ''
                }`;

                // 파티로 이동하는 링크
                const linkToParty = `${recommendedUser.party_id}`;

                return recommendedUser.team_user_profile.map((member) => (
                  <li
                    key={`${recommendedUser.party_id}-${crypto.randomUUID()}`}
                    className="flex flex-row carousel-item gap-5 "
                  >
                    <div
                      key={`${recommendedUser.party_id}-${member.user.user_id}`}
                      className={`flex flex-col items-center text-center relative pt-10 pb-4 px-4 rounded-[8px] border min-w-[160px] mr-5 hover:border-primary-400 transition duration-300
                        mobile:min-w-[156px] mobile:mr-[10px]`}
                    >
                      <button
                        onClick={() => banMutation.mutate(member.user.user_id)}
                        className="absolute top-4 right-4"
                      >
                        <Image src={closeBte} width={24} height={24} alt="닫기" />
                      </button>
                      <Image
                        src={
                          member.user.profile_img ||
                          'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
                        }
                        alt={`${member.user.nickname}의 프로필`}
                        width={80}
                        height={80}
                        style={{
                          objectFit: 'cover',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          marginBottom: '8px'
                        }}
                      />
                      <h3 className="body-m-bold">{member.user.nickname}</h3>
                      <h5 className="caption-m text-Grey-600">{member.party_nickname}</h5>
                      <Link href={`/party/${linkToParty}`}>
                        <p className="body-s hover:text-primary-400 transition duration-300">
                          {cutVideoName(videoNameWithEpisode)}
                        </p>
                      </Link>
                      <p className="body-s text-Grey-600">함께 시청했습니다.</p>
                      <button
                        onClick={() => followMutation.mutate(member.user.user_id)}
                        className="mt-2 btn-s body-xs-bold text-white w-full"
                      >
                        팔로우
                      </button>
                    </div>
                  </li>
                ));
              })
            ) : (
              <li className="py-20 flex flex-col justify-center items-center m-auto gap-2">
                <Image
                  src={doesntExist}
                  width={73}
                  height={73}
                  alt="최근 함께한 파티원이 없습니다."
                  className="mobile:w-[58px] mobile:h-[51px]"
                />
                <p className="body-m text-Grey-600">최근 함께한 파티원이 없습니다.</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </article>
  );
};

export default MyFollowRecommendation;
