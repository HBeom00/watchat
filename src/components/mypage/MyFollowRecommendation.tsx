'use client';

import { banUser } from '@/store/banUser';
import { follow } from '@/store/followUnfollow';
import { useInvitedParties } from '@/store/useInvitedParties';
import { NextButton, PrevButton, usePrevNextButtons } from '@/store/useMypageCarouselButton';
import { useRecommendedUsers } from '@/store/useRecommendedUser';
import { useFetchUserData } from '@/store/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import '@/customCSS/label.css';
import defaultAvatar from '../../../public/38d1626935054d9b34fddd879b084da5.png';

const MyFollowRecommendation = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const visibleSlides = 5; // 버튼 클릭시 움직이게 할 슬라이드 아이템 갯수

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(
    emblaApi,
    visibleSlides
  );

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

  // 초대받은 파티 가져오기
  const {
    data: invitedParties,
    isPending: pendingInvitedParties,
    isError: errorInvitedParties
  } = useInvitedParties(userId);

  console.log('초대된 파티 리스트 => ', invitedParties);

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

        return oldData.map((party) => ({
          ...party,
          team_user_profile: party.team_user_profile.filter((profile) => profile.user.user_id !== followId)
        }));
      });

      // 팔로잉 유저 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['followingUsers', userId] });
    }
  });

  console.log('추천 사용자 데이터 =>', recommendedUsers);

  //  X 버튼을 누르면 해당 유저를 추천 목록에서 밴시킴
  const banMutation = useMutation({
    mutationFn: (bannedUserId: string) => banUser(userId as string, bannedUserId),
    onSuccess: (_, bannedUserId) => {
      // 차단 후 추천 목록 업데이트
      queryClient.setQueryData<RecentParticipantsData[]>(['recommendedUser', userId], (oldData) => {
        if (!oldData) return [];
        return oldData.map((party) => ({
          ...party,
          team_user_profile: party.team_user_profile.filter((profile) => profile.user.user_id !== bannedUserId)
        }));
      });
    },
    onError: (error) => {
      console.error('차단에 실패했습니다:', error);
    }
  });

  if (isPending || pendingInvitedParties || pendingRecommendedUsers) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorInvitedParties || errorRecommenedUsers) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article className="max-w-[1140px] m-auto mb-[85px]">
      <div className="flex justify-between max-w-[1060px] m-auto mb-4">
        <h3 className="title-m">최근 함께했던 파티원</h3>
      </div>

      {/* 캐러셀 컨테이너 */}
      <div className="flex flex-row justify-between">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
          이전
        </PrevButton>
        <div ref={emblaRef} className="overflow-hidden w-full max-w-[1060px]">
          <ul className="carousel-container flex items-center gap-5">
            {recommendedUsers && recommendedUsers.length > 0 ? (
              recommendedUsers.map((recommendedUser) => {
                return (
                  <li key={`${recommendedUser.party_id}-${crypto.randomUUID()}`} className="carousel-item min-w-[16%]">
                    {recommendedUser.team_user_profile.map((member) => (
                      <div
                        key={`${recommendedUser.party_id}-${member.user.user_id}`}
                        className="flex flex-col items-center text-center relative pt-10 pb-4 rounded-[8px] border"
                      >
                        <button
                          onClick={() => banMutation.mutate(member.user.user_id)}
                          className="absolute top-4 right-4"
                        >
                          X
                        </button>
                        <Image
                          src={member.user.profile_img || defaultAvatar}
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
                        <p className="body-s">
                          {recommendedUser.video_name}
                          {recommendedUser.media_type === 'tv' && recommendedUser.episode_number
                            ? ` ${recommendedUser.episode_number} 화`
                            : ''}
                        </p>
                        <p className="body-s text-Grey-600">함께 시청했습니다.</p>
                        <button onClick={() => followMutation.mutate(member.user.user_id)} className="mt-2">
                          팔로우
                        </button>
                      </div>
                    ))}
                  </li>
                );
              })
            ) : (
              <div>최근 함께한 파티원이 없습니다.</div>
            )}
          </ul>
        </div>
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}>
          다음
        </NextButton>
      </div>
    </article>
  );
};

export default MyFollowRecommendation;
