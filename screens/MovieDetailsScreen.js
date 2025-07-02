import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import styles from "../styles/globalStyles";

export default function MovieDetailsScreen({ route }) {
  const { movie } = route.params;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
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
      </View>
    </ScrollView>
  );
}
