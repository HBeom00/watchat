'use client';

import { banUser } from '@/store/banUser';
import { follow } from '@/store/followUnfollow';
import { useInvitedParties } from '@/store/useInvitedParties';
import { useRecommendedUsers } from '@/store/useRecommendedUser';
import { useFetchUserData } from '@/store/userStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

const MyFollowRecommendation = () => {
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
    <article>
      <div>
        <h3>최근 함께했던 파티원</h3>
      </div>
      <ul>
        {recommendedUsers && recommendedUsers.length > 0 ? (
          recommendedUsers.map((recommendedUser) => {
            return (
              <li key={`${recommendedUser.party_id}-${crypto.randomUUID()}`}>
                {recommendedUser.team_user_profile.map((member) => (
                  <div key={`${recommendedUser.party_id}-${member.user.user_id}`}>
                    <button onClick={() => banMutation.mutate(member.user.user_id)}>X</button>
                    <Image
                      src={
                        member.user.profile_img ||
                        'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
                      }
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
