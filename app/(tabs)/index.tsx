import { router } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { MovieCard } from "@/components/MovieCard";
import { useFavorites } from "@/src/providers/FavoritesProvider";
import { useDiscoverMovies } from "@/src/tmdb/hooks/useDiscoverMovies";
import { tmdbPosterUrl } from "@/src/tmdb/tmdb.images";

const NUM_COLUMNS = 3;
const GAP = 8;

export default function HomeScreen() {
  const { items, isLoading, isLoadingMore, error, loadNextPage, refresh } =
    useDiscoverMovies();
  const { toggleFavorite, isFavorite } = useFavorites();

  const onEndReached = useCallback(() => {
    loadNextPage();
  }, [loadNextPage]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Discover</Text>

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
          const fav = isFavorite(item.id);

          return (
            <MovieCard
              title={item.title}
              posterUrl={poster}
              isFavorite={fav}
              onOpen={() => router.push(`/movie/${item.id}`)}
              onToggleFavorite={() =>
                toggleFavorite({
                  id: item.id,
                  title: item.title,
                  poster_path: item.poster_path,
                })
              }
            />
          );
        }}
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
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  error: { color: "crimson", marginBottom: 8 },
  listContent: { paddingBottom: 24 },
  row: { gap: GAP, marginBottom: GAP },
  footer: { textAlign: "center", paddingVertical: 16, opacity: 0.7 },
});
