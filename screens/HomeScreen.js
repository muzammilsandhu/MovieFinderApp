import React from "react";
import { View, ActivityIndicator } from "react-native";
import MovieSearchBar from "../components/MovieSearchBar";
import MovieList from "../components/MovieList";
import GenreFilter from "../components/GenreFilter";
import { useMovies } from "../hooks/useMovies";
import styles from "../styles/globalStyles";

export default function HomeScreen() {
  const {
    movies,
    favorites,
    watchLater,
    query,
    initialLoading,
    paginationLoading,
    loadingSearch,
    error,
    selectedGenre,
    refreshing,
    randomQuery,
    handleSearch,
    debouncedSearch,
    handleLoadMore,
    handleAddFavorite,
    handleAddWatchLater,
    handleRefresh,
    setQuery,
    setSelectedGenre,
    setRandomQuery,
  } = useMovies();

  const filteredMovies =
    selectedGenre === "All"
      ? movies
      : movies.filter((m) =>
          (m.genres?.map((g) => g.name).join(", ") || "")
            .toLowerCase()
            .includes(selectedGenre.toLowerCase())
        );

  return (
    <View style={styles.homeContainer}>
      <MovieSearchBar
        query={query}
        setQuery={setQuery}
        onSearch={debouncedSearch}
        loading={loadingSearch}
      />
      <GenreFilter
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        setRandomQuery={setRandomQuery}
        handleSearch={handleSearch}
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
