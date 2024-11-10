export type PartyInfo = {
  party_id: string | null;
  party_name: string;
  party_detail: string | null;
  video_name: string;
  video_platform: { name: string; logoUrl: string }[];
  video_image: string;
  limited_member: number;
  duration_time: number;
  situation: string;
  owner_id: string | null;
  video_id: number;
  media_type: string;
  watch_date: Date | null;
  start_time: Date | null;
  episode_number: number | null;
  popularity: number;
  backdrop_image: string;
  start_date_time: string;
  end_time: string;
  season_number: number;
};

// party_id,party_name,party_detail,video_name,video_platform,video_image,limited_member,duration_time,situation,owner_id,video_id,media_type,watch_date,start_time,episode_number,

export type RecruitData = {
  party_name: string;
  video_name: string;
  video_image: string;
  party_detail: string;
  duration_time: number;
  media_type: string;
  video_platform: { name: string; logoUrl: string }[];
  episode_number: number;
  season_number: number;
  watch_date: Date | null;
  start_time: Date | null;
  limited_member: number;
  video_id: number | null;
  popularity: number | null;
  backdrop_image: string;
};
