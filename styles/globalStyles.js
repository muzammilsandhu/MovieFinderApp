import { StyleSheet } from "react-native";

export default StyleSheet.create({
  homeContainer: { flex: 1, padding: 10 },
  error: { color: "red", marginTop: 10 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  input: { flex: 1, padding: 8 },
  clear: { fontSize: 16, padding: 4, color: "#999" },
  spinner: { marginLeft: 8 },

  card: { flexDirection: "row", marginBottom: 10 },
  poster: { width: 100, height: 150 },
  info: { marginLeft: 10, justifyContent: "center" },
  title: { fontSize: 18, ffontWeight: "bold" },

  favoritesContainer: { flex: 1, padding: 16, backgroundColor: "#fff" },
  favoritesTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  favouritesCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginBottom: 10,
  },
  movieTitle: { fontSize: 16 },
});
