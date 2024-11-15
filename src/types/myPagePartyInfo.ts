// 파티 정보 타입
type PartyInfo = {
  duration_time: number;
  episode_number?: number | null;
  limited_member: number;
  media_type: string;
  owner_id: string;
  party_detail: string;
  party_id: string;
  party_name: string;
  situation: string;
  start_time: string;
  end_time: string;
  video_id: number;
  video_image: string;
  video_name: string;
  video_platform: string;
  watch_date: string;
  genres?: string[]; // 장르(배열)
  privacy_setting: boolean;
  season_number?: number;
};

// 작성자 정보 타입
type OwnerProfile = {
  profile_image: string;
  nickname: string;
};

export interface MyPagePartyInfo extends PartyInfo {
  ownerProfile: OwnerProfile; // 파티 오너정보
  currentPartyPeople: number | undefined; // 참여 인원수
  startString: string;
}
