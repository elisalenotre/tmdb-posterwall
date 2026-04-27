import { FavoritesProvider } from "@/src/providers/FavoritesProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="movie/[id]"
          options={{ title: "Détails du film" }}
        />
      </Stack>
    </FavoritesProvider>
  );
}
