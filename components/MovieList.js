import { FlatList, Text, ActivityIndicator } from "react-native";
import { useRef } from "react";
import MovieCard from "./MovieCard";
import styles from "../styles/globalStyles";

export default function MovieList({
  movies,
  loading,
  error,
  onEndReached,
  onFavorite,
  onWatchLater,
  onRemove,
}) {
  const canCallOnEndReached = useRef(true);

  const handleEndReached = () => {
    if (canCallOnEndReached.current && !loading) {
      canCallOnEndReached.current = false;
      onEndReached?.();
      setTimeout(() => {
        canCallOnEndReached.current = true;
      }, 1000);
    }
  };

  return (
    <>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={movies}
        keyExtractor={(movie) => movie.imdbID}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onFavorite={onFavorite}
            onWatchLater={onWatchLater}
            onRemove={onRemove}
          />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" />
          ) : movies.length > 0 && !loading ? (
            <Text style={styles.footer}>You’ve reached the end</Text>
          ) : null
        }
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.empty}>No movies found</Text>
          ) : null
        }
      />
    </>
  );
}
