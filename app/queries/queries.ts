import {
  FetchDataArgs,
  MovieApiResponse,
  MovieCreditApiResponse,
  MovieDetail,
  MovieDownloadApiResponse,
  MovieImagesApiResponse,
  MovieKeywordApiResponse,
  MovieReviewsApiResponse,
  MovieType,
  VideoApiResponse,
} from '@/app/types';
import ENV from '@/lib/env';
import { catchError, serverResult } from '@/lib/logs';

const tmdbUrl = ENV.TMDB_URL;
const token = ENV.TMDB_API_KEY;

export async function fetchData<T>({ url, args, message }: FetchDataArgs<T>) {
  try {
    if (!url) throw Error('No url provided');

    const req = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      ...args,
    });

    if (req.status !== 200) {
      throw Error(req.statusText);
    }

    const res = await req.json();

    return serverResult(res as T, message);
  } catch (error) {
    return catchError(error);
  }
}

export const getMovies = async ({ type, page = 1 }: { page: number; type: MovieType }) => {
  const url = `${tmdbUrl}/movie/${type}?language=en-US&page=${page}`;
  return await fetchData<MovieApiResponse>({
    url,
    message: `Successfully fetched ${type}, page ${page}`,
  });
};

export const searchMovies = async ({ query, page = 1 }: { page: number; query: MovieType }) => {
  const url = `${tmdbUrl}/search/movie?query=${query}&page=${page}&include_adult=true&language=en-US&sort_by=release_date.gte
`;
  return await fetchData<MovieApiResponse>({
    url,
    message: `Successfully searched for movies with query ${query}`,
  });
};

export const searchMoviesForDownload = async ({
  query,
  page = 1,
  limit = 20,
  site = 'piratebay',
}: {
  site?: string;
  limit?: number;
  page: number;
  query: string;
}) => {
  const url = `https://torrent-api-py-nx0x.onrender.com/api/v1/search?site=${site}&query=${query}&limit=${limit}&page=${page}`;
  return await fetchData<MovieDownloadApiResponse>({
    url,
    message: `Successfully searched for movies with query ${query}, page ${page} limit ${limit} and site ${site}`,
  });
};

export const getMovieInfo = async ({ id }: { id: string }) => {
  const url = `${tmdbUrl}/movie/${id}`;

  return await fetchData<MovieDetail>({
    url,
    message: `Successfully fetched movie info for movie id ${id}`,
  });
};

export const getMovieKeyWords = async ({ id }: { id: number }) => {
  const url = `${tmdbUrl}/movie/${id}/keywords`;

  return await fetchData<MovieKeywordApiResponse>({
    url,
    message: `Successfully fetched movie keywords for movie id ${id}`,
  });
};

export const getMovieCredits = async ({ id }: { id: number }) => {
  const url = `${tmdbUrl}/movie/${id}/credits`;

  return await fetchData<MovieCreditApiResponse>({
    url,
    message: `Successfully fetched movie credits for movie id ${id}`,
  });
};

export const getSimilarMovie = async ({ id }: { id: number }) => {
  const url = `${tmdbUrl}/movie/${id}/similar`;

  return await fetchData<MovieApiResponse>({
    url,
    message: `Successfully fetched similar movie for movies id ${id}`,
  });
};

export const getRecomendedMovie = async ({ id }: { id: number }) => {
  const url = `${tmdbUrl}/movie/${id}/recommendations`;

  return await fetchData<MovieApiResponse>({
    url,
    message: `Successfully fetched movie recommendations for movie id ${id}`,
  });
};

export const getMovieReviews = async ({ id }: { id: number }) => {
  const url = `${tmdbUrl}/movie/${id}/reviews`;

  return await fetchData<MovieReviewsApiResponse>({
    url,
    message: `Successfully fetched movie reviews for movie id ${id}`,
  });
};

export const getMovieImages = async ({ id }: { id: number }) => {
  const url = `${tmdbUrl}/movie/${id}/images`;

  return await fetchData<MovieImagesApiResponse>({
    url,
    message: `Successfully fetched images for movie id ${id}`,
  });
};

export const getVideos = async ({ id }: { id: number }) => {
  const url = `${tmdbUrl}/movie/${id}/videos`;

  return await fetchData<VideoApiResponse>({
    url,
    message: `Successfully fetched videos for movie id ${id}`,
  });
};
