import { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import SearchBar from "../components/SearcBar";
import MovieList from "../components/MovieList";
import RandomKeywordLoader from "../components/RandomKeywordLoader";
import { fetchMovies } from "../services/movieApi";
import styles from "../styles/globalStyles";

export default function HomeScreen() {
  const pageRef = useRef(1);
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const debounceTimeout = useRef(null);

  const removeDuplicates = (movieArray) => {
    const seen = new Set();
    return movieArray.filter((movie) => {
      if (seen.has(movie.imdbID)) return false;
      seen.add(movie.imdbID);
      return true;
    });
  };

  const handleSearch = async (searchQuery, newPage = 1, isRandom = false) => {
    const finalQuery = searchQuery || query;

    if (!finalQuery.trim()) return;

    if (newPage === 1) {
      setMovies([]);
      setHasMore(true);
      setPage(1);
    }

    setLoading(true);
    const response = await fetchMovies(finalQuery, newPage);
    setLoading(false);

    if (response.Response === "True") {
      const newMovies = removeDuplicates(
        newPage === 1 ? response.Search : [...movies, ...response.Search]
      );

      setMovies(newMovies);
      setError("");
      setHasMore(response.Search.length === 10);

      if (newPage === 1 && !isRandom) {
        setQuery(finalQuery);
      }

      pageRef.current = newPage;
      setPage(newPage);
    } else {
      if (newPage === 1) setMovies([]);
      setHasMore(false);
      setError(response.Error || "No results found");
    }
  };

  const debouncedSearch = (text) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      handleSearch(text, 1);
    }, 500);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && query.trim() !== "") {
      const nextPage = pageRef.current + 1;
      handleSearch(query, nextPage);
    }
  };

  return (
    <View style={styles.homeContainer}>
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={debouncedSearch}
        loading={loading}
      />
      {query.length === 0 && (
        <RandomKeywordLoader onLoad={(word) => handleSearch(word, 1, true)} />
      )}
      <MovieList
        movies={movies}
        loading={loading}
        error={error}
        onEndReached={handleLoadMore}
      />
    </View>
  );
}
