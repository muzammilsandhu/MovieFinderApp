import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieList from "../components/MovieList";
import ConfirmModal from "../components/ConfirmModal";
import styles from "../styles/globalStyles";

export default function WatchLaterScreen() {
  const [watchLater, setWatchLater] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedID, setSelectedID] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadWatchLater = async () => {
    const stored = await AsyncStorage.getItem("watchLater");
    setWatchLater(stored ? JSON.parse(stored) : []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadWatchLater();
    }, [])
  );

  const confirmRemove = (imdbID) => {
    setSelectedID(imdbID);
    setModalVisible(true);
  };

  const handleRemove = async () => {
    const updated = watchLater.filter((m) => m.imdbID !== selectedID);
    await AsyncStorage.setItem("watchLater", JSON.stringify(updated));
    setWatchLater(updated);
    setModalVisible(false);
  };

  return (
    <View style={styles.moviesContainer}>
      <MovieList
        movies={watchLater}
        loading={loading}
        error={watchLater.length === 0 ? "No movies in watch later list." : ""}
        onEndReached={() => {}}
        onFavorite={() => {}}
        onWatchLater={() => {}}
        onRemove={confirmRemove}
        watchLater={watchLater}
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
