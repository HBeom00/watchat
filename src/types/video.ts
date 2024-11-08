export type videoTV = {
  adult: boolean;
  backdrop_path: string;
  genres: { id: number; name: string }[];
  id: string;
  name: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  episode_run_time: number[];
};

export type creditTV = {
  cast: {
    id: number;
    known_for_department: string;
    name: string;
    order: number;
    original_name: string;
    profile_path: string;
    total_episode_count: number;
  }[];
  id: number;
};

export type videoMOVIE = {
  adult: boolean;
  backdrop_path: string;
  genres: { id: number; name: string }[];
  id: string;
  title: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  runtime: number;
};
export type creditMOVIE = {
  cast: {
    id: number;
    known_for_department: string;
    name: string;
    order: number;
    original_name: string;
    profile_path: string;
  }[];
  id: number;
};
