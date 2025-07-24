import { View, Text, Image, ScrollView } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import styles from "../styles/globalStyles";

export default function MovieDetailsScreen({ route }) {
  const { movie } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView
        style={styles.container}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
