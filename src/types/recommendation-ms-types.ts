// this contain types from recommendation ms

export type GetSimilarGamesResponse = {
  success: boolean;
  similar_games: string[];
};

export type GetSimilarMoviesResponse = {
  success: boolean;
  similar_movies: string[];
};

export type GetSimilarTvShowResponse = {
  success: boolean;
  similar_tv_shows: string[];
};
