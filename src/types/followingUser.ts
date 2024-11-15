export type FollowingUser = {
  user_id: string;
  nickname: string;
  profile_img: string;
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
