import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  RefreshControl,
} from "react-native";
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
  onFavorite = () => {},
  onWatchLater = () => {},
  onRemove,
  refreshing = false,
  onRefresh = () => {},
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
        keyExtractor={(movie) =>
          movie.id ? movie.id.toString() : Math.random().toString()
        }
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            isFavorite={favorites?.some((m) => m.id === item.id)}
            isWatchLater={watchLater?.some((m) => m.id === item.id)}
            onFavorite={onFavorite}
            onWatchLater={onWatchLater}
            {...(onRemove && { onRemove })}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#cc0000"]}
            tintColor="#cc0000"
          />
        }
        contentContainerStyle={styles.movieListContainer}
      />
    </View>
  );
}
