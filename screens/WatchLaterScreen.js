import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieList from "../components/MovieList";
import styles from "../styles/globalStyles";

export default function WatchLaterScreen() {
  const [watchLater, setWatchLater] = useState([]);
  const [loading, setLoading] = useState(true);

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
    Alert.alert("Remove", "Remove this movie from Watch Later?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: async () => {
          const updated = watchLater.filter((m) => m.imdbID !== imdbID);
          await AsyncStorage.setItem("watchLater", JSON.stringify(updated));
          setWatchLater(updated);
        },
        style: "destructive",
      },
    ]);
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
      />
    </View>
  );
}
