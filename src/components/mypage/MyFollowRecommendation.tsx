'use client';

import { follow } from '@/store/followUnfollow';
import { useInvitedParties } from '@/store/useInvitedParties';
import { useRecommendedUsers } from '@/store/useRecommendedUser';
import { useFetchUserData } from '@/store/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const MyFollowRecommendation = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const [recommendedBox, setRecommendedBox] = useState<RecentParticipantsData[]>([]);
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
      // 추천 사용자 목록에서 팔로우한 유저 제거
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

  // 로컬 스토리지에서 추천 사용자 목록 가져오기
  useEffect(() => {
    const storedUsers = localStorage.getItem('recommendedUsers'); // 직접 문자열을 가져옵니다.
    const parsedUsers = storedUsers ? JSON.parse(storedUsers) : []; // null이 아닐 때만 JSON 파싱
    setRecommendedBox(parsedUsers);
    console.log('Initial recommended box:', parsedUsers); // 초기 값 로그 출력
  }, []);

  // 닫기 버튼 클릭 핸들러
  const handleClose = (partyId: string, userId: string) => {
    console.log(`Close button clicked for partyId: ${partyId}, userId: ${userId}`); // 이벤트 확인

    // 추천 목록 업데이트
    const updatedBox: RecentParticipantsData[] = recommendedBox
      .map((party) => {
        if (party.party_id === partyId) {
          return {
            ...party,
            team_user_profile: party.team_user_profile.filter((member) => member.user.user_id !== userId)
          };
        }
        return party;
      })
      .filter((party) => party.team_user_profile.length > 0); // 필터링된 프로필이 있는 파티만 유지

    console.log('Updated Box before saving:', updatedBox); // 업데이트된 목록 확인

    // 상태 업데이트
    setRecommendedBox(updatedBox);

    // 로컬 스토리지에 저장
    saveToLocalStorage(updatedBox);
  };

  // 로컬 스토리지 저장 함수
  const saveToLocalStorage = (data: RecentParticipantsData[]) => {
    try {
      localStorage.setItem('recommendedUsers', JSON.stringify(data));
      console.log('Recommended users saved to localStorage:', data); // 성공 로그

      // 저장 후 확인
      const savedUsers = localStorage.getItem('recommendedUsers');
      console.log('Loaded from localStorage after save:', JSON.parse(savedUsers || '[]')); // 저장된 값 로그
    } catch (error) {
      console.error('Error saving recommended users to localStorage:', error); // 에러 로그
    }
  };

  if (isPending || pendingInvitedParties || pendingRecommendedUsers) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorInvitedParties || errorRecommenedUsers) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article>
      <h3>최근 함께했던 파티원</h3>
      <ul>
        {recommendedUsers && recommendedUsers.length > 0 ? (
          recommendedUsers.map((recommendedUser) => {
            return (
              <li key={`${recommendedUser.party_id}-${crypto.randomUUID()}`}>
                {recommendedUser.team_user_profile.map((member) => (
                  <div key={`${recommendedUser.party_id}-${member.user.user_id}`}>
                    <button onClick={() => handleClose(recommendedUser.party_id, member.user.user_id)}>X</button>
                    <Image
                      src={member.user.profile_img || 'default_image_url.jpg'}
                      alt={`${member.user.nickname}의 프로필`}
                      width={80}
                      height={80}
                    />
                    <h3>{member.user.nickname}</h3>
                    <p>
                      {recommendedUser.video_name}
                      {recommendedUser.media_type === 'tv' && recommendedUser.episode_number
                        ? ` ${recommendedUser.episode_number} 화`
                        : ''}
                    </p>
                    <p>를(을) 함께 시청했습니다.</p>
                    <button onClick={() => handleClose(recommendedUser.party_id, member.user.user_id)}>X</button>
                    <button onClick={() => followMutation.mutate(member.user.user_id)}>팔로우</button>
                  </div>
                ))}
              </li>
            );
          })
        ) : (
          <div>최근 함께한 파티원이 없습니다.</div>
        )}
      </ul>
    </article>
  );
};

export default MyFollowRecommendation;
