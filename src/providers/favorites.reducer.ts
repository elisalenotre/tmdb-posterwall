import type {
    FavoritesAction,
    FavoritesState,
} from "@/src/providers/favorites.types";

export const initialFavoritesState: FavoritesState = {
  favoritesById: {},
};

export function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction,
): FavoritesState {
  switch (action.type) {
    case "TOGGLE_FAVORITE": {
      const id = action.movie.id;
      const exists = Boolean(state.favoritesById[id]);

      if (exists) {
        const { [id]: _, ...rest } = state.favoritesById;
        return { ...state, favoritesById: rest };
      }

      return {
        ...state,
        favoritesById: { ...state.favoritesById, [id]: action.movie },
      };
    }

    case "CLEAR_FAVORITES":
      return initialFavoritesState;

    default:
      return state;
  }
}
