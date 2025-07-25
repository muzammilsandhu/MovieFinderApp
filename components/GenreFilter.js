import { ScrollView, TouchableOpacity, Text } from "react-native";

export default function GenreFilter({
  selectedGenreId,
  setSelectedGenreId,
  genres,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 10, flexGrow: "unset", flexShrink: "unset" }}
    >
      <TouchableOpacity
        onPress={() => setSelectedGenreId(null)}
        style={{
          backgroundColor: selectedGenreId === null ? "#cc0000" : "#eee",
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
          marginRight: 10,
        }}
      >
        <Text
          style={{
            color: selectedGenreId === null ? "#fff" : "#333",
            fontWeight: "bold",
          }}
        >
          All
        </Text>
      </TouchableOpacity>
      {genres.map((genre) => (
        <TouchableOpacity
          key={genre.id}
          onPress={() => setSelectedGenreId(genre.id)}
          style={{
            backgroundColor: selectedGenreId === genre.id ? "#cc0000" : "#eee",
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
            marginRight: 10,
          }}
        >
          <Text
            style={{
              color: selectedGenreId === genre.id ? "#fff" : "#333",
              fontWeight: "bold",
            }}
          >
            {genre.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
