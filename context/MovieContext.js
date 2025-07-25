import { createContext, useContext, useEffect, useState } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);

  const loadLists = async () => {
    try {
      const favs = await loadFromStorage("favorites");
      const watch = await loadFromStorage("watchLater");
      setFavorites(favs || []);
      setWatchLater(watch || []);
    } catch (error) {
      console.error("Error loading lists from storage:", error);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const toggleFavorite = async (movie) => {
    try {
      const exists = favorites.some((m) => m.id === movie.id);
      const updated = exists
        ? favorites.filter((m) => m.id !== movie.id)
        : [...favorites, movie];
      setFavorites(updated);
      await saveToStorage("favorites", updated);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  };

  const toggleWatchLater = async (movie) => {
    try {
      const exists = watchLater.some((m) => m.id === movie.id);
      const updated = exists
        ? watchLater.filter((m) => m.id !== movie.id)
        : [...watchLater, movie];
      setWatchLater(updated);
      await saveToStorage("watchLater", updated);
    } catch (error) {
      console.error("Error toggling watch later:", error);
      throw error;
    }
  };

  return (
    <MovieContext.Provider
      value={{
        favorites,
        watchLater,
        toggleFavorite,
        toggleWatchLater,
        reloadLists: loadLists,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieContext must be used inside MovieProvider");
  }
  return context;
};
