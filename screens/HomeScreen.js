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

const RANDOM_KEYWORDS = [
  "movie",
  "film",
  "cinema",
  "classic",
  "recent",
  "blockbuster",
  "independent",
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
  const [error, setError] = useState(null);

  const getRandomKeyword = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * RANDOM_KEYWORDS.length);
    const keyword = RANDOM_KEYWORDS[randomIndex].toLowerCase();
    console.log(`getRandomKeyword: selected ${keyword}`);
    return keyword;
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
      const id = String(movie.id);
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

  const filteredMovies =
    selectedGenre === "All"
      ? movies
      : movies.filter((m) =>
          (m.genres?.map((g) => g.name).join(", ") || "")
            .toLowerCase()
            .includes(selectedGenre.toLowerCase())
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
            setRandomQuery(genre.toLowerCase());
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
          error={error}
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
