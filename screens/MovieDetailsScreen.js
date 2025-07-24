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

  // Function to handle play button click and redirect to Bilibili TV search page
  const handlePlay = () => {
    // Construct the Bilibili TV search URL based on the movie title
    const movieTitleFormatted = movie.Title.toLowerCase().replace(
      /\s+/g,
      "%20"
    );
    const bilibiliSearchUrl = `https://www.bilibili.tv/en/search-result?q=${movieTitleFormatted}`;

    // Open the URL in the default browser or Bilibili app
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
            uri:
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450",
          }}
          style={styles.detailsPoster}
          resizeMode="cover"
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{movie.Title}</Text>
          <Text style={styles.detailsYear}>({movie.Year})</Text>

          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>Genre:</Text>
            <Text style={styles.detailsValue}>{movie.Genre}</Text>
          </View>

          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>Director:</Text>
            <Text style={styles.detailsValue}>{movie.Director}</Text>
          </View>

          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>Actors:</Text>
            <Text style={styles.detailsValue}>{movie.Actors}</Text>
          </View>

          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>IMDb Rating:</Text>
            <Text style={styles.detailsValue}>{movie.imdbRating}</Text>
          </View>

          <Text style={styles.plot}>Plot</Text>
          <Text style={styles.plot}>{movie.Plot}</Text>

          <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
            <Text style={styles.playButtonText}>Play Movie</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
