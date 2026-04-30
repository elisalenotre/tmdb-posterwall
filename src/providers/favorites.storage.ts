import type { FavoritesState } from "@/src/providers/favorites.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "tmdb:favorites:v1";

export async function loadFavoritesState(): Promise<FavoritesState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FavoritesState;
  } catch {
    return null;
  }
}

export async function saveFavoritesState(state: FavoritesState) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    //ignore
  }
}
