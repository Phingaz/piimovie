import axios from "axios";

export const getMoviesRq = async (type: string | null, page: number) => {
  const { data } = await axios.post(`/api/movies`, { type, page });
  return data;
};

export const getMovieDetailRq = async (id: string) => {
  const { data } = await axios.post(`/api/movie/detail`, { id });
  return data;
};

export const getVideoRq = async (id: number) => {
  const { data } = await axios.post(`/api/movie/video`, { id });
  return data;
};

export const getMovieImagesRq = async (id: number) => {
  const { data } = await axios.post(`/api/movie/images`, { id });
  return data;
};

export const getMovieRecommendationsRq = async (id: number) => {
  const { data } = await axios.post(`/api/movie/recommendations`, { id });
  return data;
};

export const getMovieSimilarRq = async (id: number) => {
  const { data } = await axios.post(`/api/movie/similar`, { id });
  return data;
};

export const searchMovieRq = async (query: string | null, page: number) => {
  const { data } = await axios.post(`/api/movie/search`, { query, page });
  return data;
};

export const downloadMovieRq = async (
  searchInput: string | null,
  site = "piratebay",
  limit = 20,
  page = 1
) => {
  const { data } = await axios(
    `https://torrent-api-py-nx0x.onrender.com/api/v1/search?site=${site}&query=${searchInput}&limit=${limit}&page=${page}`
  );
  return data;
};
