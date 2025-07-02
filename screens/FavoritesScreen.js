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

  const confirmRemove = (imdbID) => {
    setSelectedID(imdbID);
    setModalVisible(true);
  };

  const handleRemove = async () => {
    const updated = favorites.filter((m) => m.imdbID !== selectedID);
    await saveToStorage("favorites", updated);
    setFavorites(updated);
    setModalVisible(false);
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
