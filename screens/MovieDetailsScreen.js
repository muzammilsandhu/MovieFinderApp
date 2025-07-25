import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import styles from "../styles/globalStyles";
import axios from "axios";

const API_KEY = "c5f72743f4ba0af4eb576449120e77cc"; // <-- Replace with your actual key
const BASE_URL = "https://api.themoviedb.org/3";

export default function MovieDetailsScreen({ route }) {
  const { movie } = route.params;
  const insets = useSafeAreaInsets();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFullDetails();
  }, []);

  const fetchFullDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/movie/${movie.id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "credits",
        },
      });
      setDetails(res.data);
    } catch (err) {
      console.error("Error fetching full movie details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    const movieTitleFormatted = movie.title
      .toLowerCase()
      .replace(/\s+/g, "%20");
    const bilibiliSearchUrl = `https://www.bilibili.tv/en/search-result?q=${movieTitleFormatted}`;
    Linking.openURL(bilibiliSearchUrl).catch((err) =>
      console.error("Failed to open Bilibili TV search:", err)
    );
  };

  if (loading || !details) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#e50914" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#000", flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
      >
        <Image
          source={{
            uri: details.poster_path
              ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
              : "https://via.placeholder.com/300x450",
          }}
          style={styles.detailsPoster}
          resizeMode="cover"
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>
            {details.title || "Unknown Title"}
          </Text>
          <Text style={styles.detailsYear}>
            ({details.release_date?.split("-")[0] || "N/A"})
          </Text>

          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>Genre:</Text>
            <Text style={styles.detailsValue}>
              {details.genres?.map((g) => g.name).join(", ") || "N/A"}
            </Text>
          </View>

          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>Director:</Text>
            <Text style={styles.detailsValue}>
              {details.credits?.crew
                ?.filter((c) => c.job === "Director")
                ?.map((d) => d.name)
                .join(", ") || "N/A"}
            </Text>
          </View>

          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>Actors:</Text>
            <Text style={styles.detailsValue}>
              {details.credits?.cast
                ?.slice(0, 5)
                .map((a) => a.name)
                .join(", ") || "N/A"}
            </Text>
          </View>

          <View style={styles.meta}>
            <Text style={styles.detailsLabel}>IMDb Rating:</Text>
            <Text style={styles.detailsValue}>
              {details.vote_average?.toFixed(1) || "N/A"}
            </Text>
          </View>

          <Text style={styles.plot}>Plot</Text>
          <Text style={styles.plot}>
            {details.overview || "No description available."}
          </Text>

          <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
