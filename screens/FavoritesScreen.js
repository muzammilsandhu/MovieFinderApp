import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import MovieList from "../components/MovieList";
import { loadFromStorage } from "../utils/storage";
import styles from "../styles/globalStyles";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await loadFromStorage("favorites");
      setFavorites(data);
      setLoading(false);
    };
    load();
  }, []);

  const removeFavourite = async (imdbID) => {
    try {
      const updated = favorites.filter((movie) => movie.imdbID !== imdbID);
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
      setFavorites(updated);
    } catch (error) {
      console.log("Error removing favourite: ", error);
    }
  };

  const confirmRemove = (imdbID) => {
    Alert.alert(
      "Remove Favourite",
      "Are you sure you want to remove this movie?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => removeFavourite(imdbID),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.favoritesContainer}>
      <Text style={styles.favoritesTitle}>Your Favorite Movies</Text>
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
