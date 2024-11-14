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

const MyFollowRecommendation = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true, // 반복하지 않음
    align: 'start' // 중앙 정렬
  });
  // const visibleSlides = 6; // 버튼 클릭시 움직이게 할 슬라이드 아이템 갯수

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  // 멤버 타입 정의
  interface Member {
    nickname: string;
    profile_img: string;
    user_id: string;
  }

  // 최근 파티원 목록 타입 정의
  interface RecentParticipantsData {
    party_id: string;
    video_name: string;
    party_name: string;
    episode_number?: number;
    media_type: string;
    team_user_profile: {
      user: Member;
    }[];
  }

  const queryClient = useQueryClient();

  // 팔로우 추천 목록 가져오기
  const {
    data: recommendedUsers,
    isPending: pendingRecommendedUsers,
    isError: errorRecommenedUsers
  } = useRecommendedUsers(userId as string);

  const emptyRecommendedUsers = recommendedUsers && recommendedUsers.length > 0;

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

  // console.log('추천 사용자 데이터 =>', recommendedUsers);

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
          queryClient.invalidateQueries({ queryKey: ['recommendedUser', userId] });
        }

        return updatedData;
      });
    },
    onError: (error) => {
      console.error('차단에 실패했습니다:', error);
    }
  });

  if (isPending || pendingRecommendedUsers) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorRecommenedUsers) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article className=" m-auto mb-[85px] w-[1060px]">
      <div className="flex justify-between m-auto mb-4">
        <h3 className="title-m">팔로우 추천</h3>
      </div>

      {/* 캐러셀 컨테이너 */}
      <div className="relative">
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

                // 길이가 8자 이상이면 잘라서 말줄임표 추가
                const cutVideoNameWithEpisode =
                  videoNameWithEpisode.length > 8 ? videoNameWithEpisode.slice(0, 8) + '...' : videoNameWithEpisode;

                // 파티로 이동하는 링크
                const linkToParty = `${recommendedUser.party_id}`;

                return recommendedUser.team_user_profile.map((member) => (
                  <li
                    key={`${recommendedUser.party_id}-${crypto.randomUUID()}`}
                    className="flex flex-row carousel-item gap-5 "
                  >
                    <div
                      key={`${recommendedUser.party_id}-${member.user.user_id}`}
                      className="flex flex-col items-center text-center relative pt-10 pb-4 px-4 rounded-[8px] border min-w-[160px] mr-5 hover:border-primary-400 transition duration-300"
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
                      <Link href={`/party/${linkToParty}`}>
                        <p className="body-s hover:text-primary-400 transition duration-300">
                          {cutVideoNameWithEpisode}
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
                <Image src={doesntExist} width={73} height={73} alt="최근 함께한 파티원이 없습니다." />
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
