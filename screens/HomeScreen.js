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

const genres = [
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

  const handleSearch = async (query, newPage = 1, isSearch = false) => {
    if (isSearch || newPage === 1) setInitialLoading(true);
    else setPaginationLoading(true);
    if (isSearch) setLoadingSearch(true);

    try {
      const searchQuery = query === "all" ? "movie" : query.toLowerCase();
      const response = await fetchMovies(searchQuery, newPage);

      if (response.Response === "True") {
        const detailedMovies = await Promise.all(
          response.Search.map(async (movie) => {
            const fullDetails = await fetchMovieDetails(movie.imdbID);
            return fullDetails.Response === "True" ? { ...fullDetails } : null;
          })
        );

        const validMovies = detailedMovies.filter(Boolean);
        const newMovies = removeDuplicates(
          newPage === 1 ? validMovies : [...movies, ...validMovies]
        );

        await new Promise((resolve) => setTimeout(resolve, 500));
        setMovies(newMovies);
        setHasMore(response.Search.length === 10);
        pageRef.current = newPage;
        if (isSearch) Keyboard.dismiss();
      } else {
        if (newPage === 1) setMovies([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setInitialLoading(false);
      setPaginationLoading(false);
      if (isSearch) setLoadingSearch(false);
    }
  };

  // ✅ Debounced wrapper to prevent rapid search
  const debouncedSearch = useCallback(
    debounce((text) => {
      handleSearch(text, 1, true);
    }, 500),
    []
  );

  const handleLoadMore = () => {
    if (!paginationLoading && hasMore && randomQuery) {
      const nextPage = pageRef.current + 1;
      handleSearch(randomQuery, nextPage, false);
    }
  };

  const removeDuplicates = (movieArray) => {
    const seen = new Set();
    return movieArray.filter((movie) => {
      const id = String(movie.imdbID);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  const handleAddFavorite = async (imdbID) => {
    const alreadyExists = favorites.some((fav) => fav.imdbID === imdbID);
    if (alreadyExists) return;

    try {
      const fullDetails = await fetchMovieDetails(imdbID);
      if (fullDetails?.Response !== "True") return;

      const updated = [...favorites, { ...fullDetails }];
      setFavorites(updated);
      await saveToStorage("favorites", updated);

      Toast.show(`${fullDetails.Title} added to favorites`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    } catch (err) {
      console.log("Favorite error:", err);
    }
  };

  const handleAddWatchLater = async (imdbID) => {
    const alreadyExists = watchLater.some((m) => m.imdbID === imdbID);
    if (alreadyExists) return;

    const fullDetails = await fetchMovieDetails(imdbID);
    if (fullDetails?.Response !== "True") return;

    const updated = [...watchLater, { ...fullDetails }];
    setWatchLater(updated);
    await saveToStorage("watchLater", updated);

    Toast.show(`${fullDetails.Title} added to Watch Later`, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
    });
  };

  const filteredMovies =
    selectedGenre === "All"
      ? movies
      : movies.filter((m) =>
          (m.Genre || "").toLowerCase().includes(selectedGenre.toLowerCase())
        );

  return (
    <View style={styles.homeContainer}>
      <MovieSearchBar
        query={query}
        setQuery={setQuery}
        onSearch={debouncedSearch} // ✅ pass debounced function
        loading={loadingSearch}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10, flexGrow: "unset", flexShrink: "unset" }}
      >
        {genres.map((genre) => (
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
          onEndReached={handleLoadMore}
          onFavorite={handleAddFavorite}
          onWatchLater={handleAddWatchLater}
        />
      )}
    </View>
  );
}
