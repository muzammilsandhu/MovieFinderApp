import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

const SORT_OPTIONS = [
  { label: "Popular", value: "popularity.desc" },
  { label: "Top Rated", value: "vote_average.desc" },
  { label: "Newest", value: "release_date.desc" },
];

export default function FilterBar({
  genres,
  filters,
  setFilters,
  availableYears = [],
}) {
  const handleGenre = (id) => {
    setFilters((prev) => ({
      ...prev,
      genreId: prev.genreId === id ? null : id,
    }));
  };

  const handleYear = (year) => {
    setFilters((prev) => ({
      ...prev,
      year: prev.year === year ? null : year,
    }));
  };

  const handleSort = (sortBy) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: prev.sortBy === sortBy ? "popularity.desc" : sortBy,
    }));
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterBarContainer}
    >
      {genres.map((genre) => (
        <TouchableOpacity
          key={genre.id}
          style={[
            styles.filterChip,
            filters.genreId === genre.id && styles.filterChipSelected,
          ]}
          onPress={() => handleGenre(genre.id)}
        >
          <Text style={styles.filterChipText}>{genre.name}</Text>
        </TouchableOpacity>
      ))}

      {availableYears.map((year) => (
        <TouchableOpacity
          key={year}
          style={[
            styles.filterChip,
            filters.year === year && styles.filterChipSelected,
          ]}
          onPress={() => handleYear(year)}
        >
          <Text style={styles.filterChipText}>{year}</Text>
        </TouchableOpacity>
      ))}

      {SORT_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.filterChip,
            filters.sortBy === option.value && styles.filterChipSelected,
          ]}
          onPress={() => handleSort(option.value)}
        >
          <Text style={styles.filterChipText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
