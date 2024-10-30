export type partyInfo = {
  party_id: string;
  party_name: string;
  party_detail: string | null;
  video_name: string;
  video_platform: string;
  video_image: string;
  limited_member: number;
  duration_time: number;
  situation: string | null;
  owner_id: string;
  video_id: number;
  media_type: string;
  watch_date: string;
  start_time: string;
  episode_number: number | null;
  popularity: number;
};
export type platform = { logoUrl: string; name: string };

// party_id,party_name,party_detail,video_name,video_platform,video_image,limited_member,duration_time,situation,owner_id,video_id,media_type,watch_date,start_time,episode_number,
