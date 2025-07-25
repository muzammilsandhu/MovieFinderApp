import React from "react";
import { View, ActivityIndicator } from "react-native";
import MovieSearchBar from "../components/MovieSearchBar";
import MovieList from "../components/MovieList";

import { useMovies } from "../hooks/useMovies";
import styles from "../styles/globalStyles";
import { useMovieContext } from "../context/MovieContext";
import FilterBar from "../components/FilterBar";

export default function HomeScreen() {
  const {
    movies,
    genres,
    query,
    initialLoading,
    paginationLoading,
    loadingSearch,
    error,
    refreshing,
    filters,
    setFilters,
    handleSearch,
    debouncedSearch,
    handleLoadMore,
    handleAddFavorite,
    handleAddWatchLater,
    handleRefresh,
    setQuery,
  } = useMovies();

  const { favorites, watchLater } = useMovieContext();

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i
  );

  return (
    <View style={styles.homeContainer}>
      <MovieSearchBar
        query={query}
        setQuery={setQuery}
        onSearch={debouncedSearch}
        loading={loadingSearch}
      />
      <FilterBar
        genres={genres}
        filters={filters}
        setFilters={setFilters}
        availableYears={availableYears}
        setQuery={setQuery}
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
          movies={movies}
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
