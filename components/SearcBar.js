import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import styles from "../styles/globalStyles";

export default function SearchBar({ query, setQuery, onSearch, loading }) {
  const handleChange = (text) => {
    setQuery(text);
    onSearch(text);
  };

  const clearInput = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search movies.."
        value={query}
        onChangeText={handleChange}
        style={styles.input}
      />
      {loading ? (
        <ActivityIndicator style={styles.spinner} size="small" />
      ) : query ? (
        <TouchableOpacity onPress={clearInput}>
          <Text style={styles.clear}>X</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
