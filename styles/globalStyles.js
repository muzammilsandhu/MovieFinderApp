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

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  modalCancel: {
    backgroundColor: "#444",
  },
  modalRemove: {
    backgroundColor: "#cc0000",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  detailsPoster: {
    width: "100%",
    height: 450,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginBottom: 6,
  },
  detailsYear: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 16,
  },
  meta: {
    flexDirection: "row",
    marginBottom: 10,
  },
  detailsLabel: {
    fontWeight: "bold",
    color: theme.textPrimary,
    width: 100,
  },
  detailsValue: {
    flex: 1,
    color: theme.textSecondary,
  },
  plotLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginTop: 24,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  plot: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.textSecondary,
  },
  playButton: {
    backgroundColor: "#cc0000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
