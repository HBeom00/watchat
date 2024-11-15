export type FollowingUser = {
  user_id: string;
  nickname: string;
  profile_img: string;
  user_email?: string;
  genre?: string[];
  platform?: string[];
  user_temp?: number;
};

export type followingUserData =
  | {
      user_id: string;
      nickname: string;
      profile_img: string;
    }[]
  | null;

export type OtherUserFollow = {
  follow_key: string;
  user_id: string;
  follow_id: string;
};
