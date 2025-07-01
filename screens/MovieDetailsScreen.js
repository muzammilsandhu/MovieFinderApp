import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import styles from "../styles/globalStyles";

export default function MovieDetailsScreen({ route }) {
  const { movie } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri:
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300x450",
        }}
        style={localStyles.poster}
        resizeMode="contain"
      />
      <View style={localStyles.detailsContainer}>
        <Text style={localStyles.title}>{movie.Title}</Text>
        <Text style={localStyles.subtitle}>Year: {movie.Year}</Text>
        <Text style={localStyles.subtitle}>Genre: {movie.Genre}</Text>
        <Text style={localStyles.subtitle}>Director: {movie.Director}</Text>
        <Text style={localStyles.subtitle}>Actors: {movie.Actors}</Text>
        <Text style={localStyles.subtitle}>
          IMDb Rating: {movie.imdbRating}
        </Text>
        <Text style={localStyles.plot}>Plot: {movie.Plot}</Text>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  poster: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // Matches DarkTheme
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#b3b3b3", // Matches tabBarInactiveTintColor
    marginBottom: 8,
  },
  plot: {
    fontSize: 14,
    color: "#b3b3b3",
    lineHeight: 22,
    marginTop: 10,
  },
});
