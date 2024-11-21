// 팔로우 추천 ( 이전 파티원 ) 목록 가져오기

import browserClient from '@/utils/supabase/client';
import { getFollowerData } from './getFollowData';

// 멤버 타입 정의
export type Member = {
  nickname: string;
  profile_img: string;
  user_id: string;
};

// 최근 파티원 목록 타입 정의
export type RecentParticipantsData = {
  party_id: string;
  video_name: string;
  party_name: string;
  episode_number?: number;
  media_type: string;
  end_time: string;
  team_user_profile: {
    party_nickname: string;
    user: Member;
  }[];
};

// 최근 함께했던 파티원 목록을 가져오기
export const getRecommendedMembers = async (userId?: string) => {
  if (!userId) {
    console.error('유효하지 않은 사용자 ID입니다.');
    return []; // userId가 없는 경우 빈 배열 반환
  }

  const currentDate = new Date(); // 현재 날짜
  const oneWeekAgo = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7); // 7일 전 날짜 계산

  // ban_recommend 테이블에서 언팔로우한 사용자 ID 가져오기
  const { data: bannedUsersData, error: bannedUsersError } = await browserClient
    .from('ban_recommend')
    .select('banned_user')
    .eq('user_id', userId); // 현재 사용자 ID로 필터링

  if (bannedUsersError) {
    console.error('차단된 사용자 목록을 가져오지 못했습니다 => ', bannedUsersError.message);
    return [];
  }

  // 차단된 사용자 목록에서 중복 제거
  const bannedUserIds = Array.from(new Set(bannedUsersData.map((bannedUser) => bannedUser.banned_user)));

  // 팔로우 데이터 가져오기
  const result = await getFollowerData(userId);

  // 팔로우 데이터에서 팔로워 목록만 followerData에 담아줌
  const followerData = result !== 0 ? result.followerData : [];

  // 팔로잉된 사용자 목록에서 user_id만 추출
  const followedUserIds = followerData?.map((user) => user.user_id) || [];

  // 사용자가 참여한 파티를 가져오기
  const { data: userParties, error: userPartiesError } = await browserClient
    .from('team_user_profile')
    .select('party_id')
    .eq('user_id', userId);

  if (userPartiesError) {
    console.error('사용자가 참여한 파티 목록을 가져오지 못했습니다 => ', userPartiesError.message);
    return [];
  }

  const userPartyIds = userParties.map((party) => party.party_id);

  // 같은 파티였던 다른 유저들 찾기 (7일 전까지)
  const { data, error } = await browserClient
    .from('party_info')
    .select(
      `
      party_id,
      video_name,
      party_name,
      episode_number,
      media_type,
      watch_date,
      end_time,
      team_user_profile (
        party_nickname: nickname,
        user: user_id (
          nickname,
          profile_img,
          user_id
        )
      )
        `
    )
    .in('party_id', userPartyIds)
    .gte('watch_date', oneWeekAgo.toISOString().split('T')[0]) // 7일 전까지의 데이터만 가져온다
    .returns<RecentParticipantsData[]>();

  if (error) {
    console.error('추천 팔로우 목록을 가져오지 못했습니다 => ', error.message);
    return [];
  }

  // 추천 목록에서 사용자 본인, 차단된 사용자, 이미 팔로우된 유저 필터링
  const filteredData = data
    .map((party) => ({
      ...party,
      team_user_profile: party.team_user_profile.filter(
        (profile) =>
          profile.user.user_id !== userId &&
          !bannedUserIds.includes(profile.user.user_id) &&
          !followedUserIds.includes(profile.user.user_id)
      )
    }))
    .filter((party) => party.team_user_profile.length > 0); // 필터링된 프로필이 있는 파티만 유지
  return filteredData;
};
