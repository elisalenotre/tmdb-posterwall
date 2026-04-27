import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Movie #{id}</Text>
    </View>
  );
}
