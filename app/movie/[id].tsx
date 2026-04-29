import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useFavorites } from "@/src/providers/FavoritesProvider";
import { useMovieDetails } from "@/src/tmdb/hooks/useMovieDetails";
import { tmdbBackdropUrl, tmdbPosterUrl } from "@/src/tmdb/tmdb.images";

export default function MovieDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();

  const id = useMemo(() => {
    const n = Number(params.id);
    return Number.isFinite(n) ? n : null;
  }, [params.id]);

  const { data, isLoading, error } = useMovieDetails(id);

  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = data ? isFavorite(data.id) : false;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Chargement…</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={[styles.text, styles.error]}>
          {error ?? "Film introuvable"}
        </Text>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const poster = tmdbPosterUrl(data.poster_path, "w342");
  const backdrop = tmdbBackdropUrl(data.backdrop_path, "w780");

  const year = data.release_date ? data.release_date.slice(0, 4) : "";
  const genres =
    data.genres
      ?.map((g) => g.name)
      .slice(0, 3)
      .join(" • ") ?? "";
  const runtime = data.runtime ? `${data.runtime} min` : "";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Backdrop */}
      <View style={styles.backdrop}>
        {backdrop ? (
          <Image
            source={{ uri: backdrop }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            transition={150}
          />
        ) : null}

        {/* Fondu (gradient) pour lisibilité du titre */}
        <LinearGradient
          colors={[
            "rgba(250,250,250,0.00)",
            "rgba(250,250,250,0.35)",
            "rgba(250,250,250,0.70)",
            "rgba(250,250,250,1.00)",
          ]}
          locations={[0, 0.45, 0.75, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* Header row poster + title */}
      <View style={styles.headerRow}>
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

        <View style={styles.headerInfo}>
          <Text style={styles.title}>{data.title}</Text>

          <Text style={styles.meta}>
            {[year, runtime].filter(Boolean).join(" • ")}
          </Text>

          {genres ? <Text style={styles.meta}>{genres}</Text> : null}

          <Text style={styles.meta}>
            ⭐ {data.vote_average?.toFixed(1) ?? "—"}
          </Text>

          <Pressable
            onPress={() =>
              toggleFavorite({
                id: data.id,
                title: data.title,
                poster_path: data.poster_path,
              })
            }
            style={[styles.favBtn, fav && styles.favBtnActive]}
          >
            <Text style={styles.favBtnText}>
              {fav ? "♥ Favori" : "♡ Ajouter"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Overview */}
      <Text style={styles.sectionTitle}>Synopsis</Text>
      <Text style={styles.overview}>{data.overview || "Pas de synopsis."}</Text>

      <Pressable onPress={() => router.back()} style={styles.backBtnBottom}>
        <Text style={styles.backBtnText}>Retour</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 24 },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
  },
  text: { color: "black" },
  error: { color: "crimson" },

  backdrop: { height: 220, backgroundColor: "white" },

  headerRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    marginTop: -60,
  },

  poster: {
    width: 120,
    aspectRatio: 2 / 3,
    borderRadius: 12,
    backgroundColor: "#eee",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  posterFallback: { color: "#666", fontWeight: "700" },

  headerInfo: { flex: 1, paddingTop: 8 },

  title: { color: "black", fontSize: 20, fontWeight: "800" },
  meta: { color: "rgba(0,0,0,0.75)", marginTop: 4 },

  favBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  favBtnActive: { backgroundColor: "rgba(220,20,60,0.20)" },
  favBtnText: { color: "black", fontWeight: "700" },

  sectionTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 16,
    paddingHorizontal: 12,
  },
  overview: {
    color: "rgba(0,0,0,0.85)",
    paddingHorizontal: 12,
    marginTop: 8,
    lineHeight: 20,
  },

  backBtn: {
    marginTop: 12,
    backgroundColor: "rgba(0,0,0,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  backBtnBottom: {
    marginTop: 16,
    marginHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  backBtnText: { color: "black", fontWeight: "700" },
});
