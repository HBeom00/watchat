export type User = {
  id: string;
  email?: string;
};

export type MutatedUser = {
  user: User | null;
  file: File | null;
  profile_image_name: string;
  nickname: string;
  pathname: string;
  platforms: string[];
  genres: string[];
  deleteOldImages: (userId: string, currentImageName: string) => Promise<void>;
};
