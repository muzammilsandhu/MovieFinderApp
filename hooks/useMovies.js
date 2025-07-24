import { useState, useEffect, useRef, useCallback } from "react";
import { fetchMovieDetails, fetchMovies } from "../services/movieApi";
import { saveToStorage, loadFromStorage } from "../utils/storage";
import debounce from "lodash/debounce";
import Toast from "react-native-root-toast";
import { Keyboard } from "react-native";

const RANDOM_KEYWORDS = [
  "movie",
  "film",
  "cinema",
  "classic",
  "recent",
  "blockbuster",
  "independent",
];

export const useMovies = () => {
  const pageRef = useRef(1);
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [initialLoading, setInitialLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [randomQuery, setRandomQuery] = useState("");

  const getRandomKeyword = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * RANDOM_KEYWORDS.length);
    const keyword = RANDOM_KEYWORDS[randomIndex].toLowerCase();
    console.log(`getRandomKeyword: selected ${keyword}`);
    return keyword;
  }, []);

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
      const favs = await loadFromStorage("favorites");
      const watch = await loadFromStorage("watchLater");
      setFavorites(favs || []);
      setWatchLater(watch || []);
      const keyword = getRandomKeyword();
      setRandomQuery(keyword);
      handleSearch(keyword, 1, false);
    };
    loadInitial();
  }, [getRandomKeyword]);

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
        console.log("Raw Search Response:", response);

        if (response.results && response.results.length > 0) {
          const detailed = await Promise.all(
            response.results.map(async (m) => {
              try {
                const details = await fetchMovieDetails(m.id);
                console.log("Detailed Response for ID:", m.id, details);
                return details && details.id
                  ? {
                      ...details,
                      title: details.title || `Movie (${details.id})`,
                    }
                  : null;
              } catch (detailError) {
                console.error(
                  "Error fetching details for ID:",
                  m.id,
                  detailError
                );
                return null;
              }
            })
          );

          const valid = detailed.filter((m) => m && m.id !== undefined);
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

  const debouncedSearch = useCallback(
    debounce((text) => {
      handleSearch(text, 1, true);
    }, 500),
    [handleSearch]
  );

  const handleLoadMore = () => {
    if (!paginationLoading && hasMore && randomQuery) {
      const nextPage = pageRef.current + 1;
      console.log(`handleLoadMore: loading page ${nextPage}`);
      handleSearch(randomQuery, nextPage);
    }
  };

  const handleAddFavorite = async (movie) => {
    const exists = favorites.some((fav) => fav.id === movie.id);
    let updated;
    if (exists) {
      updated = favorites.filter((fav) => fav.id !== movie.id);
      Toast.show(`${movie.title} removed from favorites`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } else {
      const fullDetails = await fetchMovieDetails(movie.id);
      if (!fullDetails) return;
      updated = [...favorites, fullDetails];
      Toast.show(`${fullDetails.title} added to favorites`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    }

    setFavorites(updated);
    await saveToStorage("favorites", updated);
  };

  const handleAddWatchLater = async (movie) => {
    const exists = watchLater.some((w) => w.id === movie.id);
    let updated;
    if (exists) {
      updated = watchLater.filter((w) => w.id !== movie.id);
      Toast.show(`${movie.title} removed from Watch Later`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } else {
      const fullDetails = await fetchMovieDetails(movie.id);
      if (!fullDetails) return;
      updated = [...watchLater, fullDetails];
      Toast.show(`${fullDetails.title} added to Watch Later`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    }

    setWatchLater(updated);
    await saveToStorage("watchLater", updated);
  };

  const handleRefresh = async () => {
    console.log("handleRefresh: starting refresh");
    setRefreshing(true);
    pageRef.current = 1;
    setMovies([]);
    const newKeyword = getRandomKeyword();
    setRandomQuery(newKeyword);
    setSelectedGenre("All");
    await handleSearch(newKeyword, 1, true);
    setRefreshing(false);
    console.log(`handleRefresh: completed with keyword=${newKeyword}`);
  };

  return {
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
  };
};
