import { FlatList, Text, ActivityIndicator } from "react-native";
import MovieCard from "./MovieCard";
import styles from "../styles/globalStyles";

export default function MovieList({ movies, loading, error, onEndReached }) {
  return (
    <>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={movies}
        keyExtractor={(movie) => movie.imdbID}
        renderItem={({ item }) => <MovieCard movie={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Text style={styles.footer}>You’ve reached the end</Text>
          )
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
