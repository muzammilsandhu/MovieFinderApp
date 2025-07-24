import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View } from "react-native";
import MovieList from "../components/MovieList";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import ConfirmModal from "../components/ConfirmModal";
import styles from "../styles/globalStyles";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedID, setSelectedID] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadFavorites = async () => {
    const stored = await loadFromStorage("favorites");
    setFavorites(stored || []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const confirmRemove = (id) => {
    setSelectedID(id);
    setModalVisible(true);
  };

  const handleRemove = async () => {
    const updated = favorites.filter((m) => m.id !== selectedID);
    await saveToStorage("favorites", updated);
    setFavorites(updated);
    setModalVisible(false);
  };

  const toggleFavorite = async (movie) => {
    const exists = favorites.find((m) => m.id === movie.id);
    if (exists) {
      const updated = favorites.filter((m) => m.id !== movie.id);
      setFavorites(updated);
      await saveToStorage("favorites", updated);
    } else {
      const updated = [...favorites, movie];
      setFavorites(updated);
      await saveToStorage("favorites", updated);
    }
  };

  return (
    <View style={styles.moviesContainer}>
      <MovieList
        movies={favorites}
        loading={loading}
        error={favorites.length === 0 ? "No favorites yet." : ""}
        onEndReached={() => {}}
        onFavorite={toggleFavorite}
        onWatchLater={() => {}}
        onRemove={confirmRemove}
        favorites={favorites}
      />

      <ConfirmModal
        visible={modalVisible}
        title="Remove Movie"
        message="Remove this movie from favorites?"
        onCancel={() => setModalVisible(false)}
        onConfirm={handleRemove}
      />
    </View>
  );
}
