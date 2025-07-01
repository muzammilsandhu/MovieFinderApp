import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-root-toast";
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
  const [loadingMovies, setLoadingMovies] = useState(false);
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
    if (isSearch) setLoadingSearch(true);
    setLoadingMovies(true);
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

        await new Promise((resolve) => setTimeout(resolve, 500)); // slight delay for UI
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
      if (isSearch) setLoadingSearch(false);
      setLoadingMovies(false);
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

  const handleLoadMore = () => {
    if (!loadingMovies && hasMore && randomQuery) {
      const nextPage = pageRef.current + 1;
      handleSearch(randomQuery, nextPage, false);
    }
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

  const handleAddWatchLater = async (movie) => {
    if (!watchLater.find((m) => m.imdbID === movie.imdbID)) {
      const updated = [...watchLater, movie];
      setWatchLater(updated);
      await saveToStorage("watchLater", updated);

      Toast.show(`${movie.Title} added to Watch Later`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
    }
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
        onSearch={(text) => handleSearch(text, 1, true)}
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

      {loadingMovies ? (
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
          loading={loadingMovies}
          onEndReached={handleLoadMore}
          onFavorite={handleAddFavorite}
          onWatchLater={handleAddWatchLater}
        />
      )}
    </View>
  );
}
