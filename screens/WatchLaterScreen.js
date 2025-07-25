import { useState } from "react";
import { View } from "react-native";
import MovieList from "../components/MovieList";
import ConfirmModal from "../components/ConfirmModal";
import styles from "../styles/globalStyles";
import { useMovieContext } from "../context/MovieContext";

export default function WatchLaterScreen() {
  const { watchLater, toggleWatchLater, reloadLists } = useMovieContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedID, setSelectedID] = useState(null);

  const confirmRemove = (id) => {
    setSelectedID(id);
    setModalVisible(true);
  };

  const handleRemove = async () => {
    if (!selectedID) return;
    await toggleWatchLater({ id: selectedID });
    setModalVisible(false);
    setSelectedID(null);
    await reloadLists();
  };

  return (
    <View style={styles.moviesContainer}>
      <MovieList
        movies={watchLater}
        loading={false}
        error={watchLater.length === 0 ? "No movies in watch later list." : ""}
        onEndReached={() => {}}
        onFavorite={() => {}}
        onWatchLater={toggleWatchLater}
        onRemove={confirmRemove}
      />
      <ConfirmModal
        visible={modalVisible}
        title="Remove Movie"
        message="Remove this movie from watch later?"
        onCancel={() => setModalVisible(false)}
        onConfirm={handleRemove}
      />
    </View>
  );
}
