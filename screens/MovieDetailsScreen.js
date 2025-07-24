import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import styles from "../styles/globalStyles";

export default function MovieDetailsScreen({ route }) {
  const { movie } = route.params;
  const insets = useSafeAreaInsets();

  const handlePlay = () => {
    const movieTitleFormatted = movie.title
      .toLowerCase()
      .replace(/\s+/g, "%20");
    const bilibiliSearchUrl = `https://www.bilibili.tv/en/search-result?q=${movieTitleFormatted}`;
    Linking.openURL(bilibiliSearchUrl).catch((err) =>
      console.error("Failed to open Bilibili TV search:", err)
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#000" }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
      >
        <Image
          source={{
            uri: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450",
          }}
          style={styles.detailsPoster}
          resizeMode="cover"
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>
            {movie.title || "Unknown Title"}
          </Text>
          <Text style={styles.detailsYear}>
            ({movie.release_date?.split("-")[0] || "N/A"})
          </Text>
          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>Genre:</Text>
            <Text style={styles.detailsValue}>
              {movie.genres?.map((genre) => genre.name).join(", ") || "N/A"}
            </Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>Director:</Text>
            <Text style={styles.detailsValue}>
              {movie.credits?.crew
                ?.filter((c) => c.job === "Director")
                ?.map((d) => d.name)
                .join(", ") || "N/A"}
            </Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>Actors:</Text>
            <Text style={styles.detailsValue}>
              {movie.credits?.cast?.map((c) => c.name).join(", ") || "N/A"}
            </Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>IMDb Rating:</Text>
            <Text style={styles.detailsValue}>
              {movie.vote_average || "N/A"}
            </Text>
          </View>
          <Text style={styles.plot}>Plot</Text>
          <Text style={styles.plot}>
            {movie.overview || "No description available."}
          </Text>
          <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
