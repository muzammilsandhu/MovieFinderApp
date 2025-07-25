import { useState } from "react";
import { View } from "react-native";
import MovieList from "../components/MovieList";
import ConfirmModal from "../components/ConfirmModal";
import styles from "../styles/globalStyles";
import { useMovieContext } from "../context/MovieContext";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, reloadLists } = useMovieContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  const confirmRemove = (id) => {
    setSelectedID(id);
    setModalVisible(true);
  };

  const handleRemove = async () => {
    if (!selectedID) return;
    await toggleFavorite({ id: selectedID });
    setModalVisible(false);
    setSelectedID(null);
    await reloadLists();
  };

  return (
    <View style={styles.moviesContainer}>
      <MovieList
        movies={favorites}
        loading={false}
        error={favorites.length === 0 ? "No favorites yet." : ""}
        onEndReached={() => {}}
        onFavorite={toggleFavorite}
        onWatchLater={() => {}}
        onRemove={confirmRemove}
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
