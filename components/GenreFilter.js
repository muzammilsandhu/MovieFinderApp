import { ScrollView, TouchableOpacity, Text } from "react-native";

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

export default function GenreFilter({
  selectedGenre,
  setSelectedGenre,
  setRandomQuery,
  handleSearch,
}) {
  return (
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
}
