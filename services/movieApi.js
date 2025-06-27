const API_KEY = "a19f2a70";
const BASE_URL = "https://www.omdbapi.com";

export const fetchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/?apikey=${API_KEY}&s=${query
        .trim()
        .toLowerCase()}&page=${page}`
    );
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return { Response: "False", Error: "Network error" };
  }
};

export const fetchMovieDetails = async (id) => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
  return await response.json();
};
