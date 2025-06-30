import { FlatList, Text, ActivityIndicator, View } from "react-native";
import { useRef } from "react";
import MovieCard from "./MovieCard";
import styles from "../styles/globalStyles";

export default function MovieList({
  movies,
  favorites,
  watchLater,
  loading,
  error,
  onEndReached,
  onFavorite = [],
  onWatchLater = [],
  onRemove,
}) {
  const canCallOnEndReached = useRef(true);

  const handleEndReached = () => {
    if (canCallOnEndReached.current) {
      canCallOnEndReached.current = false;
      onEndReached?.();
      setTimeout(() => {
        canCallOnEndReached.current = true;
      }, 1000);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={movies}
        keyExtractor={(movie) => movie.imdbID}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            isFavorite={favorites?.some((m) => m.imdbID === item.imdbID)}
            isWatchLater={watchLater?.some((m) => m.imdbID === item.imdbID)}
            onFavorite={onFavorite}
            onWatchLater={onWatchLater}
            onRemove={onRemove}
          />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color="#cc0000" />
        }
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.empty}>No movies found</Text>
          ) : null
        }
      />
    </View>
  );
}
