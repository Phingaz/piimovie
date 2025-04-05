import ENV from '@/lib/env';
import {
  CreditApiResponse,
  DownloadApiResponse,
  ImagesApiResponse,
  KeywordApiResponse,
  ListApiResponse,
  ReviewsApiResponse,
  VideoApiResponse,
} from '../types/api';
import { fetchData } from './utils';
import { ListType, SortOption } from '../types/utils';
import { Show, ShowDetail } from '../types/show';
import { MovieDetail, Movie } from '../types/movies';

const tmdbUrl = ENV.TMDB_URL;

export const getListing = async <T extends ListType>(
  data: { fetchCategory?: boolean; type: ListType } & SortOption,
) => {
  const {
    type,
    fetchCategory,
    category,
    page = 1,
    sort_by,
    include_adult,
    vote_average,
    vote_count,
    with_release_type,
    genres,
    release_date_gte,
    release_date_lte,
    air_date_gte,
    air_date_lte,
    with_origin_country,
    with_original_language,
    without_genres,
  } = data;

  const url = fetchCategory
    ? `${tmdbUrl}/${type}/${category}?language=en-US&page=${page}&include_adult=false`
    : `${tmdbUrl}/discover/${type}?` +
      new URLSearchParams({
        language: 'en-US',
        page: page.toString(),
        ...(sort_by && { sort_by }),
        ...(include_adult && { include_adult: include_adult.toString() }),
        ...(vote_average && { 'vote_average.gte': vote_average.toString() }),
        ...(vote_count && { 'vote_count.gte': vote_count.toString() }),
        ...(with_release_type && { with_release_type }),
        ...(genres && { with_genres: genres }),
        ...(release_date_gte && { 'release_date.gte': release_date_gte }),
        ...(release_date_lte && { 'release_date.lte': release_date_lte }),
        ...(air_date_gte && { 'first_air_date.gte': air_date_gte }),
        ...(air_date_lte && { 'first_air_date.lte': air_date_lte }),
        ...(with_origin_country && { with_origin_country }),
        ...(with_original_language && { with_original_language }),
        ...(without_genres && { without_genres }),
      }).toString();

  return await fetchData<ListApiResponse<T extends 'movie' ? Movie : Show>>({
    url,
    message: `Successfully fetched ${url}`,
  });
};

export const search = async <T extends ListType>({
  query,
  type,
  page = 1,
}: {
  query: string;
  page: number;
  type: ListType;
}) => {
  const url = `${tmdbUrl}/search/${type}?query=${query}&page=${page}&include_adult=true&language=en-US
`;
  return await fetchData<ListApiResponse<T extends 'movie' ? Movie : Show>>({
    url,
    message: `Successfully searched for ${type} with query ${query}`,
  });
};

export const getReviews = async ({ id, type }: { id: number; type: ListType }) => {
  const url = `${tmdbUrl}/${type}/${id}/reviews`;

  return await fetchData<ReviewsApiResponse>({
    url,
    message: `Successfully fetched ${type} reviews for ${type} id ${id}`,
  });
};

export const getDetails = async <T extends ListType>({ id, type }: { id: string; type: T }) => {
  const url = `${tmdbUrl}/${type}/${id}`;

  return await fetchData<T extends 'movie' ? MovieDetail : ShowDetail>({
    url,
    message: `Successfully fetched ${type} info for ${type} id ${id}`,
  });
};

export const getKeyWords = async ({ id, type }: { id: number; type: ListType }) => {
  const url = `${tmdbUrl}/${type}/${id}/keywords`;

  return await fetchData<KeywordApiResponse>({
    url,
    message: `Successfully fetched ${type} keywords for ${type} id ${id}`,
  });
};

export const getCredits = async ({ id, type }: { id: number; type: ListType }) => {
  const url = `${tmdbUrl}/${type}/${id}/credits`;

  return await fetchData<CreditApiResponse>({
    url,
    message: `Successfully fetched ${type} credits for ${type} id ${id}`,
  });
};

export const getSimilar = async <T extends ListType>({ id, type }: { id: number; type: T }) => {
  const url = `${tmdbUrl}/${type}/${id}/similar`;

  return await fetchData<ListApiResponse<T extends 'movie' ? Movie : Show>>({
    url,
    message: `Successfully fetched similar ${type} for ${type}s id ${id}`,
  });
};

export const getRecomendation = async <T extends ListType>({ id, type }: { id: number; type: T }) => {
  const url = `${tmdbUrl}/${type}/${id}/recommendations`;

  return await fetchData<ListApiResponse<T extends 'movie' ? Movie : Show>>({
    url,
    message: `Successfully fetched ${type} recommendations for ${type} id ${id}`,
  });
};

export const getImages = async ({ id, type }: { id: number; type: ListType }) => {
  const url = `${tmdbUrl}/${type}/${id}/images`;

  return await fetchData<ImagesApiResponse>({
    url,
    message: `Successfully fetched images for ${type} id ${id}`,
  });
};

export const getVideos = async ({ id, type }: { id: number; type: ListType }) => {
  const url = `${tmdbUrl}/${type}/${id}/videos`;

  return await fetchData<VideoApiResponse>({
    url,
    message: `Successfully fetched videos for ${type} id ${id}`,
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
  return await fetchData<DownloadApiResponse>({
    url,
    message: `Successfully searched for movies with query ${query}, page ${page} limit ${limit} and site ${site}`,
  });
};
