import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useDebouncedValue } from "@/src/core/utils/debounce";
import { useSearchMovies } from "@/src/tmdb/hooks/useSearchMovies";
import { tmdbPosterUrl } from "@/src/tmdb/tmdb.images";

import { useFavorites } from "@/src/providers/FavoritesProvider";

const NUM_COLUMNS = 3;
const GAP = 8;

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 450);

  const { items, isLoading, isLoadingMore, error, loadNextPage, refresh } =
    useSearchMovies(debouncedQuery);

  const { toggleFavorite, isFavorite } = useFavorites();

  const onEndReached = useCallback(() => {
    loadNextPage();
  }, [loadNextPage]);

  return (
    <View style={styles.screen}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher un film…"
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        renderItem={({ item }) => {
          const poster = tmdbPosterUrl(item.poster_path, "w342");

          return (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/movie/${item.id}`)}
            >
              <View style={styles.poster}>
                {poster ? (
                  <Image
                    source={{ uri: poster }}
                    style={StyleSheet.absoluteFillObject}
                    contentFit="cover"
                    transition={150}
                  />
                ) : (
                  <Text style={styles.posterFallback}>NO POSTER</Text>
                )}
              </View>

              <Text numberOfLines={2} style={styles.movieTitle}>
                {item.title}
              </Text>
              <Pressable
                onPress={() =>
                  toggleFavorite({
                    id: item.id,
                    title: item.title,
                    poster_path: item.poster_path,
                  })
                }
                style={[
                  styles.heart,
                  isFavorite(item.id) && styles.heartActive,
                ]}
              >
                <Text style={styles.heartText}>
                  {isFavorite(item.id) ? "♥" : "♡"}
                </Text>
              </Pressable>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          debouncedQuery.trim().length > 0 && !isLoading ? (
            <Text style={styles.empty}>Aucun résultat.</Text>
          ) : (
            <Text style={styles.empty}>
              Tape un titre de film pour lancer la recherche.
            </Text>
          )
        }
        ListFooterComponent={
          isLoadingMore ? (
            <Text style={styles.footer}>Loading more…</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 12, paddingTop: 12 },
  input: {
    height: 44,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#dddddd",
    color: "black",
    marginBottom: 12,
  },
  error: { color: "crimson", marginBottom: 8 },
  listContent: { paddingBottom: 24 },
  row: { gap: GAP, marginBottom: GAP },
  card: { flex: 1 },
  poster: {
    aspectRatio: 2 / 3,
    borderRadius: 10,
    backgroundColor: "#cdcdcd",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  posterFallback: { color: "#aaa", fontWeight: "700" },
  movieTitle: { marginTop: 6, fontSize: 12, color: "black" },
  empty: {
    textAlign: "center",
    paddingVertical: 24,
    opacity: 0.7,
    color: "black",
  },
  heart: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  heartActive: {
    backgroundColor: "rgba(220,20,60,0.8)",
  },
  heartText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    paddingVertical: 16,
    opacity: 0.7,
    color: "black",
  },
});
