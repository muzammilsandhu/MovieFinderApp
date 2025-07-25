import axios from "axios";

const API_KEY = "c5f72743f4ba0af4eb576449120e77cc";
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "credits",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const fetchDiscoverMovies = async ({
  page = 1,
  genreId = null,
  year = null,
  sortBy = "popularity.desc",
}) => {
  try {
    const params = {
      api_key: API_KEY,
      page,
      sort_by: sortBy,
    };
    if (genreId) params.with_genres = genreId;
    if (year) params.primary_release_year = year;
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching discover movies:", error);
    throw error;
  }
};
