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
  const [genres, setGenres] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    genreId: null,
    year: null,
    sortBy: "popularity.desc",
  });
  const { favorites, watchLater, toggleFavorite, toggleWatchLater } =
    useMovieContext();

  const getRandomCriteria = useCallback(() => {
    const validGenres = genres.filter((g) => g && g.id);

    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - 1970 + 1 },
      (_, i) => 1970 + i
    );

    const useGenre = validGenres.length > 0 && Math.random() > 0.4;
    const useYear = Math.random() > 0.2;

    const genreId = useGenre
      ? validGenres[Math.floor(Math.random() * validGenres.length)].id
      : null;

    const year = useYear
      ? years[Math.floor(Math.random() * years.length)]
      : null;

    console.log(`🎲 getRandomCriteria → genreId=${genreId}, year=${year}`);
    return { genreId, year };
  }, [genres]);

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

  const handleSearch = useCallback(
    async (searchTerm, newPage = 1, isSearch = false) => {
      console.log(
        `handleSearch: term=${searchTerm}, page=${newPage}, isSearch=${isSearch}`
      );
      if (isSearch || newPage === 1) setInitialLoading(true);
      else setPaginationLoading(true);
      if (isSearch) setLoadingSearch(true);
      setError(null);

      try {
        const keyword = searchTerm.toLowerCase();
        const response = await fetchMovies(keyword, newPage);
        console.log("Search Response:", response);

        if (response.results && response.results.length > 0) {
          const valid = response.results.filter((m) => m && m.id);
          if (valid.length === 0 && newPage === 1) {
            setError("No valid movies found for this query");
          }
          const newList = newPage === 1 ? valid : [...movies, ...valid];
          setMovies(removeDuplicates(newList));
          setHasMore(response.results.length === 20);
          pageRef.current = newPage;

          if (isSearch) Keyboard.dismiss();
          console.log(
            `handleSearch: fetched ${valid.length} movies, hasMore=${
              response.results.length === 20
            }`
          );
        } else {
          if (newPage === 1) setMovies([]);
          setHasMore(false);
          setError(response.status_message || "No movies found for this query");
          console.log(
            `handleSearch: no results, error=${response.status_message}`
          );
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch movies. Please try again.");
      } finally {
        setInitialLoading(false);
        setPaginationLoading(false);
        if (isSearch) setLoadingSearch(false);
      }
    },
    [movies, removeDuplicates]
  );

  const handleDiscover = useCallback(
    async (newPage = 1, isRefresh = false) => {
      const { genreId, year } = getRandomCriteria();
      console.log(
        `handleDiscover: genreId=${genreId}, year=${year}, page=${newPage}, isRefresh=${isRefresh}`
      );

      if (newPage === 1) setInitialLoading(true);
      else setPaginationLoading(true);
      setError(null);

      try {
        const response = await fetchDiscoverMovies({
          genreId,
          year,
          page: newPage,
        });

        if (response.results && response.results.length > 0) {
          const valid = response.results.filter((m) => m && m.id);
          const newList = newPage === 1 ? valid : [...movies, ...valid];
          setMovies(removeDuplicates(newList));
          setHasMore(response.results.length === 20);
          pageRef.current = newPage;
        } else {
          if (newPage === 1) setMovies([]);
          setHasMore(false);
          setError("No movies found for this criteria");
        }
      } catch (err) {
        console.error("Discover fetch error:", err);
        setError("Failed to fetch movies. Please try again.");
      } finally {
        setInitialLoading(false);
        setPaginationLoading(false);
      }
    },
    [movies, removeDuplicates, getRandomCriteria]
  );

  const debouncedSearch = useCallback(
    debounce((text) => {
      setSelectedGenreId(null);
      setSelectedYear(null);
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
    try {
      await toggleFavorite(movie);
      const isFavorite = !favorites.some((fav) => fav.id === movie.id);
      Toast.show(
        `${movie.title} ${isFavorite ? "added to" : "removed from"} favorites`,
        {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        }
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Toast.show("Failed to update favorites", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    }
  };

  const handleAddWatchLater = async (movie) => {
    try {
      await toggleWatchLater(movie);
      const isWatchLater = !watchLater.some((w) => w.id === movie.id);
      Toast.show(
        `${movie.title} ${
          isWatchLater ? "added to" : "removed from"
        } Watch Later`,
        {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        }
      );
    } catch (error) {
      console.error("Error toggling watch later:", error);
      Toast.show("Failed to update watch later", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    }
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
    setSelectedYear,
  };
};
