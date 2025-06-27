import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MovieCard({
  movie,
  onFavorite,
  onWatchLater,
  onRemove,
}) {
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/100x150",
        }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text>{movie.Year}</Text>
        <View style={styles.actions}>
          {onFavorite && (
            <TouchableOpacity onPress={() => onFavorite(movie)}>
              <Text style={styles.actionButton}>❤️ Favorite</Text>
            </TouchableOpacity>
          )}
          {onWatchLater && (
            <TouchableOpacity onPress={() => onWatchLater(movie)}>
              <Text style={styles.actionButton}>⏰ Watch Later</Text>
            </TouchableOpacity>
          )}
          {onRemove && (
            <TouchableOpacity onPress={() => onRemove(movie.imdbID)}>
              <Text style={[styles.actionButton, { color: "red" }]}>
                🗑 Remove
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
