export type FavoriteMovie = {
  id: number;
  title: string;
  poster_path: string | null;
};

export type FavoritesState = {
  favoritesById: Record<number, FavoriteMovie>;
};

export type FavoritesAction =
  | { type: "TOGGLE_FAVORITE"; movie: FavoriteMovie }
  | { type: "CLEAR_FAVORITES" }
  | { type: "HYDRATE"; state: FavoritesState };
