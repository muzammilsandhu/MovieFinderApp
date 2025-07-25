import React from "react";
import { View, ActivityIndicator } from "react-native";
import MovieSearchBar from "../components/MovieSearchBar";
import MovieList from "../components/MovieList";
import GenreFilter from "../components/GenreFilter";
import { useMovies } from "../hooks/useMovies";
import styles from "../styles/globalStyles";
import { useMovieContext } from "../context/MovieContext";

export default function HomeScreen() {
  const {
    movies,
    genres,
    query,
    initialLoading,
    paginationLoading,
    loadingSearch,
    error,
    selectedGenreId,
    refreshing,
    handleSearch,
    debouncedSearch,
    handleLoadMore,
    handleAddFavorite,
    handleAddWatchLater,
    handleRefresh,
    setQuery,
    setSelectedGenreId,
  } = useMovies();
  const { favorites, watchLater } = useMovieContext();

  const filteredMovies =
    selectedGenreId === null
      ? movies
      : movies.filter((movie) => movie.genre_ids?.includes(selectedGenreId));

  return (
    <View style={styles.homeContainer}>
      <MovieSearchBar
        query={query}
        setQuery={setQuery}
        onSearch={debouncedSearch}
        loading={loadingSearch}
      />
      <GenreFilter
        selectedGenreId={selectedGenreId}
        setSelectedGenreId={setSelectedGenreId}
        genres={genres}
      />
      {initialLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator
            size="large"
            color="#cc0000"
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      ) : (
        <MovieList
          movies={filteredMovies}
          favorites={favorites}
          watchLater={watchLater}
          error={error}
          loading={paginationLoading}
          onEndReached={handleLoadMore}
          onFavorite={handleAddFavorite}
          onWatchLater={handleAddWatchLater}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
}
