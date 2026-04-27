import {
    favoritesReducer,
    initialFavoritesState,
} from "@/src/providers/favorites.reducer";
import type {
    FavoriteMovie,
    FavoritesState,
} from "@/src/providers/favorites.types";
import React, { createContext, useContext, useMemo, useReducer } from "react";

type FavoritesContextValue = {
  state: FavoritesState;
  toggleFavorite: (movie: FavoriteMovie) => void;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState);

  const value = useMemo<FavoritesContextValue>(() => {
    return {
      state,
      toggleFavorite: (movie) => dispatch({ type: "TOGGLE_FAVORITE", movie }),
      isFavorite: (id) => Boolean(state.favoritesById[id]),
    };
  }, [state]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}
