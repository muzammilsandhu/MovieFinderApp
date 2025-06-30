import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Toast from "react-native-root-toast";
import MovieList from "../components/MovieList";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [randomQuery, setRandomQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const loadInitial = async () => {
      const favs = await loadFromStorage("favorites");
      const watch = await loadFromStorage("watchLater");
      setFavorites(favs);
      setWatchLater(watch);

      const keyword = getRandomKeyword();
      setRandomQuery(keyword);
      handleSearch(keyword, 1);
    };
    loadInitial();
  }, []);

  const getRandomKeyword = () => {
    const index = Math.floor(Math.random() * genres.length);
    return genres[index].toLowerCase();
  };

  const handleSearch = async (query, newPage = 1) => {
    setLoading(true);
    try {
      const response = await fetchMovies(query, newPage);
      if (response.Response === "True") {
        const detailedMovies = await Promise.all(
          response.Search.map(async (movie) => {
            const fullDetails = await fetchMovieDetails(movie.imdbID);
            return fullDetails.Response === "True" ? fullDetails : null;
          })
        );

        const validMovies = detailedMovies.filter(Boolean);
        const newMovies = removeDuplicates(
          newPage === 1 ? validMovies : [...movies, ...validMovies]
        );

        setMovies(newMovies);
        setHasMore(response.Search.length === 10);
        pageRef.current = newPage;
      } else {
        if (newPage === 1) setMovies([]);
        setHasMore(false);
        setError(response.Error || "No results found");
      }
    } catch (error) {
      console.error("Error fetching:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && randomQuery) {
      const nextPage = pageRef.current + 1;
      handleSearch(randomQuery, nextPage);
    }
  };

  const removeDuplicates = (movieArray) => {
    const seen = new Set();
    return movieArray.filter((movie) => {
      if (seen.has(movie.imdbID)) return false;
      seen.add(movie.imdbID);
      return true;
    });
  };

  const handleAddFavorite = async (movie) => {
    if (!favorites.find((fav) => fav.imdbID === movie.imdbID)) {
      const updated = [...favorites, movie];
      setFavorites(updated);
      await saveToStorage("favorites", updated);
      Toast.show(`${movie.Title} added to favorites`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
      });
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10, flexGrow: "unset", flexShrink: "unset" }}
      >
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            onPress={() => setSelectedGenre(genre)}
            style={{
              backgroundColor: selectedGenre === genre ? "#cc0000" : "#eee",
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              marginRight: 10,
            }}
          >
            <Text style={{ color: selectedGenre === genre ? "#fff" : "#333" }}>
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <MovieList
        movies={filteredMovies}
        favorites={favorites}
        watchLater={watchLater}
        loading={loading}
        error={error}
        onEndReached={handleLoadMore}
        onFavorite={handleAddFavorite}
        onWatchLater={handleAddWatchLater}
      />
    </View>
  );
}
