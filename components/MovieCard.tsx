import { Image } from "expo-image";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type MovieCardProps = {
  title: string;
  posterUrl: string | null;
  isFavorite: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
};

export function MovieCard({
  title,
  posterUrl,
  isFavorite,
  onOpen,
  onToggleFavorite,
}: MovieCardProps) {
  const heartProgress = useSharedValue(0);

  const animateHeart = () => {
    // éviter d’interrompre l’animation en cours, ça ferait un effet de “freeze” pas joli
    cancelAnimation(heartProgress);
    heartProgress.value = 0;

    heartProgress.value = withSequence(
      withTiming(1, { duration: 120 }),
      // soit fade-out propre :
      withTiming(0, { duration: 220 }),
      // soit un petit spring retour (optionnel) :
      withSpring(0, { damping: 14, stiffness: 180 }),
    );
  };

  const doubleTap = useMemo(() => {
    return Gesture.Tap()
      .numberOfTaps(2)
      .maxDelay(250)
      .onEnd(() => {
        scheduleOnRN(onToggleFavorite);
        animateHeart();
      });
  }, [onToggleFavorite]);

  const singleTap = useMemo(() => {
    return Gesture.Tap()
      .numberOfTaps(1)
      .maxDelay(250)
      .onEnd(() => {
        scheduleOnRN(onOpen);
      });
  }, [onOpen]);

  // double tap prioritaire sur single tap
  const composed = useMemo(() => {
    return Gesture.Exclusive(doubleTap, singleTap);
  }, [doubleTap, singleTap]);

  const bigHeartStyle = useAnimatedStyle(() => {
    const opacity = interpolate(heartProgress.value, [0, 1], [0, 1]);
    const scale = interpolate(heartProgress.value, [0, 1], [0.6, 1.2]);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <View style={styles.card}>
        <View style={styles.poster}>
          {posterUrl ? (
            <Image
              source={{ uri: posterUrl }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={150}
            />
          ) : (
            <Text style={styles.posterFallback}>NO POSTER</Text>
          )}

          {/* coeur permanent en haut à droite */}
          <View style={[styles.heart, isFavorite && styles.heartActive]}>
            <Text style={styles.heartText}>{isFavorite ? "♥" : "♡"}</Text>
          </View>

          {/* coeur animé au centre au double tap */}
          <Animated.View
            pointerEvents="none"
            style={[styles.bigHeart, bigHeartStyle]}
          >
            <Text style={styles.bigHeartText}>♥</Text>
          </Animated.View>
        </View>

        <Text numberOfLines={2} style={styles.movieTitle}>
          {title}
        </Text>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
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

  heart: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  heartActive: { backgroundColor: "rgba(220,20,60,0.8)" },
  heartText: { color: "white", fontSize: 16, fontWeight: "700" },

  bigHeart: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 80,
    height: 80,
    marginLeft: -40,
    marginTop: -40,
    alignItems: "center",
    justifyContent: "center",
  },
  bigHeartText: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 56,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowRadius: 10,
  },
});
