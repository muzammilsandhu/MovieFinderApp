import {
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/globalStyles";

export default function MovieSearchBar({ query, setQuery, onSearch, loading }) {
  return (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color="#aaa"
        style={{ marginRight: 5 }}
      />
      <TextInput
        style={styles.input}
        placeholder="Search movies.."
        placeholderTextColor="#888"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          onSearch(text);
        }}
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            setQuery("");
          }}
        >
          <Ionicons name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
}
