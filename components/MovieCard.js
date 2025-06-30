import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";

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
        <View>
          <Text style={styles.title}>{movie.Title}</Text>
          <Text>{movie.Year}</Text>
        </View>
        <View style={styles.actions}>
          {onFavorite && (
            <TouchableOpacity
              onPress={() => onFavorite(movie)}
              style={styles.actionButton}
            >
              <Ionicons name="heart-outline" size={24} color="#ff4b4b" />
            </TouchableOpacity>
          )}
          {onWatchLater && (
            <TouchableOpacity
              onPress={() => onWatchLater(movie)}
              style={styles.actionButton}
            >
              <Ionicons name="time-outline" size={24} color="#007bff" />
            </TouchableOpacity>
          )}
          {onRemove && (
            <TouchableOpacity
              onPress={() => onRemove(movie.imdbID)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={24} color="#d11a2a" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
