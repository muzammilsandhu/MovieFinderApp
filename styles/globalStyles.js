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

  card: {
    flexDirection: "row",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 2,
  },
  poster: { width: 100, height: 150, borderRadius: 4 },
  info: { flex: 1, paddingLeft: 10, justifyContent: "space-between" },
  title: { fontSize: 16, ffontWeight: "bold" },
  year: { color: "#555" },
  actions: { marginTop: 10 },
  actionButton: { fontSize: 14, marginertical: 4, color: "#007BFF" },

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
