import { useState, useEffect, useRef, useCallback } from "react";
import { Keyboard } from "react-native";
import Toast from "react-native-root-toast";
import debounce from "lodash/debounce";
import {
  fetchMovies,
  fetchDiscoverMovies,
  fetchGenres,
} from "../services/movieApi";
import { useMovieContext } from "../context/MovieContext";
import { loadFromStorage, saveToStorage } from "../utils/storage";

export const useMovies = () => {
  const pageRef = useRef(1);
  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    genreId: null,
    year: null,
    sortBy: "popularity.desc",
  });
  const [genres, setGenres] = useState([]);

  const { favorites, watchLater, toggleFavorite, toggleWatchLater } =
    useMovieContext();

  const removeDuplicates = useCallback((movieArray) => {
    const seen = new Set();
    return movieArray.filter((movie) => {
      const id = String(movie.id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, []);

  useEffect(() => {
    const loadInitial = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        let genreList = await loadFromStorage("genres");
        if (!genreList || genreList.length === 0) {
          genreList = await fetchGenres();
          await saveToStorage("genres", genreList);
        }
        setGenres(genreList || []);
        await handleDiscover(1);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError("Failed to load initial data.");
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitial();
  }, []);

  useEffect(() => {
    pageRef.current = 1;
    setMovies([]);
    handleDiscover(1);
  }, [filters]);

  const handleDiscover = useCallback(
    async (newPage = 1) => {
      const { genreId, year, sortBy } = filters;

      if (newPage === 1) setInitialLoading(true);
      else setPaginationLoading(true);
      setError(null);

      try {
        const response = await fetchDiscoverMovies({
          genreId,
          year,
          sortBy,
          page: newPage,
        });

        const valid = response.results?.filter((m) => m && m.id) || [];
        const newList = newPage === 1 ? valid : [...movies, ...valid];
        setMovies(removeDuplicates(newList));
        setHasMore(response.results.length === 20);
        pageRef.current = newPage;
      } catch (err) {
        console.error("Discover fetch error:", err);
        setError("Failed to fetch movies.");
      } finally {
        setInitialLoading(false);
        setPaginationLoading(false);
      }
    },
    [movies, filters]
  );

  const handleSearch = useCallback(
    async (searchTerm, newPage = 1, isSearch = false) => {
      if (isSearch || newPage === 1) setInitialLoading(true);
      else setPaginationLoading(true);
      if (isSearch) setLoadingSearch(true);
      setError(null);

      try {
        const keyword = searchTerm.toLowerCase();
        const response = await fetchMovies(keyword, newPage);
        const valid = response.results.filter((m) => m && m.id);
        const newList = newPage === 1 ? valid : [...movies, ...valid];
        setMovies(removeDuplicates(newList));
        setHasMore(response.results.length === 20);
        pageRef.current = newPage;
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch movies.");
      } finally {
        setInitialLoading(false);
        setPaginationLoading(false);
        if (isSearch) setLoadingSearch(false);
      }
    },
    [movies, removeDuplicates]
  );

  const debouncedSearch = useCallback(
    debounce((text) => {
      setQuery(text);
      handleSearch(text, 1, true);
    }, 500),
    [handleSearch]
  );

  const handleLoadMore = () => {
    if (!paginationLoading && hasMore) {
      const nextPage = pageRef.current + 1;
      handleDiscover(nextPage);
    }
  };

  const handleAddFavorite = async (movie) => {
    await toggleFavorite(movie);
    const isFavorite = !favorites.some((fav) => fav.id === movie.id);
    Toast.show(
      `${movie.title} ${isFavorite ? "added to" : "removed from"} favorites`,
      { duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM }
    );
  };

  const handleAddWatchLater = async (movie) => {
    await toggleWatchLater(movie);
    const isWatchLater = !watchLater.some((w) => w.id === movie.id);
    Toast.show(
      `${movie.title} ${
        isWatchLater ? "added to" : "removed from"
      } Watch Later`,
      { duration: Toast.durations.SHORT, position: Toast.positions.BOTTOM }
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    pageRef.current = 1;
    setMovies([]);
    await handleDiscover(1);
    setRefreshing(false);
  };

  return {
    movies,
    favorites,
    watchLater,
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
  };
};
