// 팔로우 추천 ( 이전 파티원 ) 목록 가져오기

import browserClient from '@/utils/supabase/client';

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

// 최근 함께했던 파티원 목록을 가져오기
export const getRecommendedMembers = async () => {
  const currentDate = new Date(); // 현재 날짜
  const oneWeekAgo = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7); // 7일 전 날짜 계산

  const { data, error } = await browserClient
    .from('party_info')
    .select(
      `
      video_name,
      party_name,
      episode_number,
      media_type,
      watch_date,
      team_user_profile (
        user: user_id (
          nickname,
          profile_img,
          user_id
        )
      )
        `
    )
    .eq('situation', '종료')
    .gte('watch_date', oneWeekAgo.toISOString().split('T')[0]) // 7일 전까지의 데이터만 가져온다
    .returns<RecentParticipantsData[]>();

  // NOTE: .gte => 2번째 인자 값보다 크거나 같은 행

  if (error) {
    console.error('추천 팔로우 목록을 가져오지 못했습니다 => ', error.message);
    return [];
  }
  console.log('팔로우 추천 목록 => ', data);

  return data;
};
