import { View, Text, Image } from "react-native";
import styles from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MovieCard({ movie }) {
  const addToFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem("favorites");
      const current = stored ? JSON.parse(stored) : [];

      const exists = current.some((m) => m.imdbID === movie.imdbID);
      if (!exists) {
        const updated = [...current, movie];
        await AsyncStorage.setItem("favorites", JSON.stringify(updated));
        alert("Added to favorites!");
      } else {
        alert("Already in favories");
      }
    } catch (error) {
      console.log("Error saving favourite: ", error);
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/100x150?text=No+Image",
        }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text>{movie.Year}</Text>
      </View>
    </View>
  );
}
