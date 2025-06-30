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
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
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
  },
  poster: { width: 100, height: 150, borderRadius: 4 },
  info: { paddingLeft: 12, justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "bold" },
  year: { color: "#777", fontSize: 14 },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  moviesContainer: { flex: 1, padding: 16, backgroundColor: "#fff" },
  moviesTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  favouritesCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },
  movieTitle: { fontSize: 16, fontWeight: 500 },

  footer: {
    textAlign: "center",
    color: "#888",
    paddingVertical: 12,
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 16,
  },
});
