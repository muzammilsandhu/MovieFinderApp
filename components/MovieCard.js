import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/globalStyles";

export default function MovieCard({
  movie,
  isFavorite,
  isWatchLater,
  onFavorite,
  onWatchLater,
  onRemove,
}) {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate("MovieDetails", { movie })}
    >
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
          <TouchableOpacity
            onPress={() => navigation.navigate("MovieDetails", { movie })}
          >
            <Text style={styles.title}>{movie.Title}</Text>
          </TouchableOpacity>
          <Text style={styles.year}>{movie.Year}</Text>
          <Text numberOfLines={4} style={styles.plot}>
            {movie.Plot || "No description available."}
          </Text>

          <View style={styles.actions}>
            {onFavorite && (
              <TouchableOpacity
                onPress={() => onFavorite(movie.imdbID)}
                style={styles.actionButton}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={24}
                  color="#ff4b4b"
                />
              </TouchableOpacity>
            )}
            {onWatchLater && (
              <TouchableOpacity
                onPress={() => onWatchLater(movie.imdbID)}
                style={styles.actionButton}
              >
                <Ionicons
                  name={isWatchLater ? "time" : "time-outline"}
                  size={24}
                  color="#007bff"
                />
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
    </TouchableWithoutFeedback>
  );
}
