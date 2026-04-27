export type TmdbPaginatedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
};
