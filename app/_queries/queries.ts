'use server';
import ENV from '@/lib/env';
import {
  CreditApiResponse,
  DownloadApiResponse,
  ImagesApiResponse,
  KeywordApiResponse,
  ListApiResponse,
  ReviewsApiResponse,
  VideoApiResponse,
} from '../_types/api';
import { fetchData } from './utils';
import { ListType, FilterOption } from '../_types/utils';
import { getQueryString } from '@/lib/utils';
import { Show, ShowDetail } from '../_types/show';
import { MovieDetail, Movie } from '../_types/movies';
import { SeasonDetail } from '../_types/utils';

const tmdbUrl = ENV.TMDB_URL;

export const fetchDiscover = async <T extends ListType>({ type, params }: { type: ListType; params: string }) => {
  const url = `${tmdbUrl}/discover/${type}?${params}`;
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
const url = `${tmdbUrl}/search/${type}?query=${query}&page=${page}&include_adult=true&language=en-US`;
  return await fetchData<ListApiResponse<T extends 'movie' ? Movie : Show>>({
    url,
    message: `Successfully searched for ${type} with query ${query}`,
  });
};

export const searchPerPage = async <T extends ListType>({
  query,
  type,
  page = 1,
  per = 20,
}: {
  query: string;
  page: number;
  per?: number;
  type: ListType;
}) => {
  const perPage = per ?? 20;
  if (perPage === 20) return await search({ query, page, type });

  const requestedPage = page;
  const startIndex = (requestedPage - 1) * perPage;
  const endIndexExclusive = startIndex + perPage;

  const tmdbPageSize = 20;
  const firstTmdbPage = Math.floor(startIndex / tmdbPageSize) + 1;
  const lastTmdbPage = Math.floor((endIndexExclusive - 1) / tmdbPageSize) + 1;

  const fetchedResults: Array<Movie | Show> = [];
  let singleResp: { data?: ListApiResponse<Movie | Show> } | null = null;
  for (let p = firstTmdbPage; p <= lastTmdbPage; p++) {
    const res = await search({ page: p, query, type });
    if (!res.data) return res;
    singleResp = res as { data: ListApiResponse<Movie | Show>; success: boolean; message: string };
    fetchedResults.push(...(res.data.results as Array<Movie | Show>));
  }

  const uniqueMap = new Map<number, Movie | Show>();
  for (const it of fetchedResults) {
    const id = (it as unknown as { id: number }).id;
    if (!uniqueMap.has(id)) uniqueMap.set(id, it);
  }
  const uniqueResults = Array.from(uniqueMap.values());
  const sliceStart = startIndex - (firstTmdbPage - 1) * tmdbPageSize;
  const sliced = uniqueResults.slice(sliceStart, sliceStart + perPage);

  return {
    data: {
      page: requestedPage,
      results: sliced,
      total_pages: singleResp?.data?.total_pages ?? 1,
      total_results: singleResp?.data?.total_results ?? fetchedResults.length,
    } as ListApiResponse<Movie | Show>,
    success: true,
    message: `Successfully searched for ${type} with query ${query} (per=${perPage} page=${requestedPage})`,
  } as unknown as ListApiResponse<T extends 'movie' ? Movie : Show>;
};

export const fetchDiscoverPerPage = async <T extends ListType>({
  type,
  baseParams,
  page = 1,
  per = 20,
}: {
  type: ListType;
  baseParams: FilterOption;
  page?: number;
  per?: number;
}) => {
  const perPage = per ?? 20;
  if (perPage === 20) {
    const params = getQueryString(baseParams);
    return await fetchDiscover({ type, params });
  }

  const requestedPage = page;
  const startIndex = (requestedPage - 1) * perPage;
  const endIndexExclusive = startIndex + perPage;

  const tmdbPageSize = 20;
  const firstTmdbPage = Math.floor(startIndex / tmdbPageSize) + 1;
  const lastTmdbPage = Math.floor((endIndexExclusive - 1) / tmdbPageSize) + 1;

  const fetchedResults: Array<Movie | Show> = [];
  let singleResp: { data?: ListApiResponse<Movie | Show> } | null = null;
  const base = { ...baseParams } as Record<string, string>;

  for (let p = firstTmdbPage; p <= lastTmdbPage; p++) {
    base.page = p.toString();
    const params = getQueryString(base as unknown as FilterOption);
    const res = await fetchDiscover({ type, params });
    if (!res.data) return res;
    singleResp = res as { data: ListApiResponse<Movie | Show>; success: boolean; message: string };
    fetchedResults.push(...(res.data.results as Array<Movie | Show>));
  }

  const uniqueMap = new Map<number, Movie | Show>();
  for (const it of fetchedResults) {
    const id = (it as unknown as { id: number }).id;
    if (!uniqueMap.has(id)) uniqueMap.set(id, it);
  }
  const uniqueResults = Array.from(uniqueMap.values());
  const sliceStart = startIndex - (firstTmdbPage - 1) * tmdbPageSize;
  const sliced = uniqueResults.slice(sliceStart, sliceStart + perPage);

  return {
    data: {
      page: requestedPage,
      results: sliced,
      total_pages: singleResp?.data?.total_pages ?? 1,
      total_results: singleResp?.data?.total_results ?? fetchedResults.length,
    } as ListApiResponse<Movie | Show>,
    success: true,
    message: `Successfully fetched discover for ${type} (per=${perPage} page=${requestedPage})`,
  } as unknown as ListApiResponse<T extends 'movie' ? Movie : Show>;
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

export const getSeasonDetails = async ({ tvId, seasonNumber }: { tvId: number; seasonNumber: number }) => {
  const url = `${tmdbUrl}/tv/${tvId}/season/${seasonNumber}`;

  return await fetchData<SeasonDetail>({
    url,
    message: `Successfully fetched season ${seasonNumber} details for tv show ${tvId}`,
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
