import { StyleSheet } from "react-native";
import { theme } from "../constants/theme";

export default StyleSheet.create({
  homeContainer: { flex: 1, padding: 10 },
  error: { color: theme.accent, marginTop: 10 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  input: { flex: 1, padding: 8 },
  clear: { fontSize: 16, padding: 4, color: theme.textSecondary },
  spinner: { marginLeft: 8 },

  card: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 10,
    padding: 10,
    backgroundColor: theme.card,
    borderRadius: 6,
  },
  poster: { width: 100, height: 150, borderRadius: 4 },
  info: {
    paddingLeft: 12,
    justifyContent: "space-between",
    flex: 1,
  },
  title: { fontSize: 18, fontWeight: "bold", color: theme.textPrimary },
  year: { color: theme.textSecondary, fontSize: 14 },
  plot: { fontSize: 13, color: theme.textSecondary, marginTop: 4 },

  actions: {
    flexDirection: "row",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  moviesContainer: { flex: 1, padding: 16 },
  favouritesCard: {
    padding: 12,
    borderRadius: 8,
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
