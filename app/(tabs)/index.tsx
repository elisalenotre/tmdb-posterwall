import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { useDiscoverMovies } from "@/src/tmdb/hooks/useDiscoverMovies";
import { tmdbPosterUrl } from "@/src/tmdb/tmdb.images";

const NUM_COLUMNS = 3;
const GAP = 8;

export default function HomeScreen() {
  const { items, isLoading, isLoadingMore, error, loadNextPage, refresh } =
    useDiscoverMovies();

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
            </Pressable>
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
  card: { flex: 1 },
  poster: {
    aspectRatio: 2 / 3,
    borderRadius: 10,
    backgroundColor: "#222",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  posterFallback: { color: "#aaa", fontWeight: "700" },
  movieTitle: { marginTop: 6, fontSize: 12 },
  footer: { textAlign: "center", paddingVertical: 16, opacity: 0.7 },
});
