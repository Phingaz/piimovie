import axios from "@/lib/axios";

export const getMoviesRq = async (type: string | null, page: number) => {
  const { data } = await axios(
    `https://api.themoviedb.org/3/movie/${type}?language=en-US&page=${page}`
  );
  return data;
};

export const getMovieDetailRq = async (id: string) => {
  const { data } = await axios(`https://api.themoviedb.org/3/movie/${id}`);
  return data;
};

export const getVideoRq = async (id: number) => {
  const { data } = await axios(
    `https://api.themoviedb.org/3/movie/${id}/videos`
  );
  return data;
};

export const getMovieImagesRq = async (id: number) => {
  const { data } = await axios(
    `https://api.themoviedb.org/3/movie/${id}/images`
  );
  return data;
};

export const getMovieRecommendationsRq = async (id: number) => {
  const { data } = await axios(
    `https://api.themoviedb.org/3/movie/${id}/recommendations`
  );
  return data;
};

export const getMovieSimilarRq = async (id: number) => {
  const { data } = await axios(
    `https://api.themoviedb.org/3/movie/${id}/similar`
  );
  return data;
};

export const searchMovieRq = async (query: string | null, page: number) => {
  const { data } = await axios(
    `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}&include_adult=true&language=en-US`
  );
  return data;
};
