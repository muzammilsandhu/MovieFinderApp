import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-root-toast";
import debounce from "lodash/debounce";
import MovieList from "../components/MovieList";
import MovieSearchBar from "../components/MovieSearchBar";
import { fetchMovieDetails, fetchMovies } from "../services/movieApi";
import { saveToStorage, loadFromStorage } from "../utils/storage";
import styles from "../styles/globalStyles";

const GENRES = [
  "All",
  "Action",
  "Comedy",
  "Romance",
  "Thriller",
  "Crime",
  "Sci-Fi",
  "Horror",
  "Drama",
  "Fantasy",
];

export default function HomeScreen() {
  const pageRef = useRef(1);
  const [movies, setMovies] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [randomQuery, setRandomQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [query, setQuery] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const loadInitial = async () => {
      const favs = await loadFromStorage("favorites");
      const watch = await loadFromStorage("watchLater");
      setFavorites(favs || []);
      setWatchLater(watch || []);

      const keyword = "movie";
      setRandomQuery(keyword);
      handleSearch(keyword, 1, false);
    };
    loadInitial();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const reloadFavorites = async () => {
        const favs = await loadFromStorage("favorites");
        setFavorites(favs || []);
      };
      reloadFavorites();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const reloadLists = async () => {
        const favs = await loadFromStorage("favorites");
        const watch = await loadFromStorage("watchLater");
        setFavorites(favs || []);
        setWatchLater(watch || []);
      };
      reloadLists();
    }, [])
  );

  const removeDuplicates = useCallback((movieArray) => {
    const seen = new Set();
    return movieArray.filter((movie) => {
      const id = String(movie.imdbID);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, []);

  const handleSearch = useCallback(
    async (searchTerm, newPage = 1, isSearch = false) => {
      console.log(
        `handleSearch: term=${searchTerm}, page=${newPage}, isSearch=${isSearch}`
      );
      if (isSearch || newPage === 1) setInitialLoading(true);
      else setPaginationLoading(true);
      if (isSearch) setLoadingSearch(true);
      setError(null); // Clear previous errors

      try {
        const keyword =
          searchTerm === "all" ? "movie" : searchTerm.toLowerCase();
        const response = await fetchMovies(keyword, newPage);

        if (response.Response === "True") {
          const detailed = await Promise.all(
            response.Search.map(async (m) => {
              const details = await fetchMovieDetails(m.imdbID);
              return details.Response === "True" ? details : null;
            })
          );

          const valid = detailed.filter(Boolean);
          const newList = newPage === 1 ? valid : [...movies, ...valid];
          setMovies(removeDuplicates(newList));
          setHasMore(response.Search.length === 10);
          pageRef.current = newPage;

          if (isSearch) Keyboard.dismiss();
          console.log(
            `handleSearch: fetched ${valid.length} movies, hasMore=${
              response.Search.length === 10
            }`
          );
        } else {
          if (newPage === 1) setMovies([]);
          setHasMore(false);
          setError(response.Error || "No movies found for this query");
          console.log(`handleSearch: no results, error=${response.Error}`);
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
    const exists = favorites.some((fav) => fav.imdbID === movie.imdbID);

    let updated;
    if (exists) {
      updated = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
      Toast.show(`${movie.Title} removed from favorites`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } else {
      const fullDetails = await fetchMovieDetails(movie.imdbID);
      if (!fullDetails || fullDetails.Response !== "True") return;
      updated = [...favorites, fullDetails];

      Toast.show(`${fullDetails.Title} added to favorites`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    }

    setFavorites(updated);
    await saveToStorage("favorites", updated);
  };

  const handleAddWatchLater = async (movie) => {
    const exists = watchLater.some((w) => w.imdbID === movie.imdbID);

    let updated;
    if (exists) {
      updated = watchLater.filter((w) => w.imdbID !== movie.imdbID);
      Toast.show(`${movie.Title} removed from Watch Later`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } else {
      const fullDetails = await fetchMovieDetails(movie.imdbID);
      if (!fullDetails || fullDetails.Response !== "True") return;
      updated = [...watchLater, fullDetails];

      Toast.show(`${fullDetails.Title} added to Watch Later`, {
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
    await handleSearch(randomQuery || "movie", 1, true);
    setRefreshing(false);
    console.log("handleRefresh: completed");
  };

  const filteredMovies =
    selectedGenre === "All"
      ? movies
      : movies.filter((m) =>
          (m.Genre || "").toLowerCase().includes(selectedGenre.toLowerCase())
        );

  const renderGenres = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 10, flexGrow: "unset", flexShrink: "unset" }}
    >
      {GENRES.map((genre) => (
        <TouchableOpacity
          key={genre}
          onPress={() => {
            setSelectedGenre(genre);
            handleSearch(genre.toLowerCase(), 1, true);
          }}
          style={{
            backgroundColor: selectedGenre === genre ? "#cc0000" : "#eee",
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            marginRight: 10,
          }}
        >
          <Text
            style={{
              color: selectedGenre === genre ? "#fff" : "#333",
              fontWeight: "bold",
            }}
          >
            {genre}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.homeContainer}>
      <MovieSearchBar
        query={query}
        setQuery={setQuery}
        onSearch={debouncedSearch}
        loading={loadingSearch}
      />

      {renderGenres()}

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
          loading={paginationLoading}
          error={error} // Pass error state
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
