import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieList from "../components/MovieList";
import { loadFromStorage } from "../utils/storage";
import styles from "../styles/globalStyles";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem("favorites");
    setFavorites(stored ? JSON.parse(stored) : []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const confirmRemove = (imdbID) => {
    Alert.alert("Remove", "Remove this movie from favorites?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: async () => {
          const updated = favorites.filter((m) => m.imdbID !== imdbID);
          await AsyncStorage.setItem("favorites", JSON.stringify(updated));
          setFavorites(updated);
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.moviesContainer}>
      <MovieList
        movies={favorites}
        loading={loading}
        error={favorites.length === 0 ? "No favorites yet." : ""}
        onEndReached={() => {}}
        onFavorite={() => {}}
        onWatchLater={() => {}}
        onRemove={confirmRemove}
      />
    </View>
  );
}
