import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { useFavorites } from "@/src/providers/FavoritesProvider";
import { tmdbPosterUrl } from "@/src/tmdb/tmdb.images";

const NUM_COLUMNS = 3;
const GAP = 8;

export default function FavoritesScreen() {
  const { state } = useFavorites();

  const favorites = useMemo(() => {
    return Object.values(state.favoritesById);
  }, [state.favoritesById]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => String(item.id)}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun favori pour le moment.</Text>
        }
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 12, paddingTop: 12 },
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
  movieTitle: { marginTop: 6, fontSize: 12, color: "black" },
  empty: {
    textAlign: "center",
    paddingVertical: 24,
    opacity: 0.7,
    color: "black",
  },
});
