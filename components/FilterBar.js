import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import styles from "../styles/globalStyles";
import { Picker } from "@react-native-picker/picker";

const SORT_OPTIONS = [
  { label: "Popular", value: "popularity.desc" },
  { label: "Top Rated", value: "vote_average.desc" },
  { label: "Newest", value: "release_date.desc" },
];

export default function FilterBar({
  filters,
  setFilters,
  genres,
  availableYears,
  setQuery,
}) {
  const handleReset = () => {
    setQuery("");
    setFilters({
      genreId: null,
      year: null,
      sortBy: "popularity.desc",
    });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: "row",
        paddingHorizontal: 10,
        gap: 10,
      }}
      style={{
        marginBottom: 10,
        flexGrow: "unset",
        flexShrink: "unset",
      }}
    >
      <View style={styles.filterDropdown}>
        <Picker
          selectedValue={filters.year}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, year: value }))
          }
          dropdownIconColor="#fff"
          style={styles.picker}
        >
          <Picker.Item label="Year" value={null} style={styles.pickerItem} />
          {availableYears.map((year) => (
            <Picker.Item
              key={year}
              label={String(year)}
              value={year}
              style={styles.pickerItem}
              color="#fff"
            />
          ))}
        </Picker>
      </View>

      <View style={styles.filterDropdown}>
        <Picker
          selectedValue={filters.genreId}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, genreId: value }))
          }
          dropdownIconColor="#fff"
          style={styles.picker}
        >
          <Picker.Item label="Genre" value={null} style={styles.pickerItem} />
          {genres.map((genre) => (
            <Picker.Item
              key={genre.id}
              label={genre.name}
              value={genre.id}
              style={styles.pickerItem}
              color="#fff"
            />
          ))}
        </Picker>
      </View>

      <View style={styles.filterDropdown}>
        <Picker
          selectedValue={filters.sortBy}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, sortBy: value }))
          }
          dropdownIconColor="#fff"
          style={styles.picker}
        >
          <Picker.Item label="Sort By" value={null} style={styles.pickerItem} />
          {SORT_OPTIONS.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
              style={styles.pickerItem}
              color="#fff"
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Reset</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
