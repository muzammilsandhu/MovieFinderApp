import { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import styles from "../styles/globalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem("favorites");
      if (stored !== null) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Error loading favorites: ", error);
    }
  };

  const removeFavourite = async (imdbID) => {
    try {
      const updated = favorites.filter((movie) => movie.imdbID !== imdbID);
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
      setFavorites(updated);
    } catch (error) {
      console.log("Error removing favourite: ", error);
    }
  };

  const confirmRemove = (imdbID) => {
    Alert.alert(
      "Remove Favourite",
      "Are you sure you want to remove this movie?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: () => removeFavourite(imdbID),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.favoritesContainer}>
      <Text style={styles.favoritesTitle}>Your Favorite Movies</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <View style={styles.favouritesCard}>
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Button
              title="Remove"
              color="red"
              onPress={() => confirmRemove(item.imdbID)}
            />
          </View>
        )}
        ListEmptyComponent={<Text>No favorites saved yet.</Text>}
      />
    </View>
  );
}
