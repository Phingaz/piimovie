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
import { ListType } from '../_types/utils';
import { Show, ShowDetail } from '../_types/show';
import { MovieDetail, Movie } from '../_types/movies';
import db from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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

export const syncUserMovieRatings = async (options: {
  maxAge?: number;
  batchSize?: number;
}): Promise<{ synced: number; failed: number }> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error('User is required for rating sync');
  }

  const { maxAge = 24, batchSize = 10 } = options;
  const maxAgeMs = maxAge * 60 * 60 * 1000;
  const cutoffTime = new Date(Date.now() - maxAgeMs);
  const userId = session.user.id;

  try {
    // Get movies that need rating updates
    const staleMovies = await db.movie.findMany({
      where: { userId, lastRatingSync: { lt: cutoffTime } },
      take: batchSize,
      orderBy: { lastRatingSync: 'asc' },
    });

    if (staleMovies.length === 0) {
      console.log('No movies need rating sync', { userId });
      return { synced: 0, failed: 0 };
    }

    console.log(`Syncing ratings for ${staleMovies.length} movies`, {
      userId,
      movieCount: staleMovies.length,
    });

    let synced = 0;
    let failed = 0;
    const updatePromises: Promise<void>[] = [];

    for (let i = 0; i < staleMovies.length; i += 3) {
      const batch = staleMovies.slice(i, i + 3);

      const batchPromises = batch.map(async (movie) => {
        try {
          // Fetch current movie data from TMDB
          const response = await getDetails({
            id: movie.id.toString(),
            type: movie.type as 'movie' | 'tv',
          });

          if (!response.success || !response.data) {
            console.warn('Failed to fetch movie data from TMDB', {
              movieId: movie.id,
              userId,
              error: response.message,
            });
            failed++;
            return;
          }

          const tmdbData = response.data;
          const newRating = Number(tmdbData.vote_average.toFixed()) || 0;

          // Always update lastRatingSync to prevent infinite syncing
          const updateData: { vote_average: number; lastRatingSync: Date } = {
            vote_average: newRating,
            lastRatingSync: new Date(),
          };

          updatePromises.push(
            db.movie
              .update({
                where: { id: movie.id },
                data: updateData,
              })
              .then(() => {
                const hasChanged = movie.vote_average !== newRating;
                console.log('Synced movie rating', {
                  movieId: movie.id,
                  title: movie.title,
                  oldRating: movie.vote_average,
                  newRating,
                  changed: hasChanged,
                  userId,
                });
              }),
          );

          synced++;
        } catch (error) {
          console.error('Failed to sync movie rating', {
            movieId: movie.id,
            userId,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          failed++;
        }
      });

      await Promise.allSettled(batchPromises);

      if (i + 3 < staleMovies.length) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
    }

    if (updatePromises.length > 0) {
      await Promise.allSettled(updatePromises);
    }

    console.log('Rating sync completed', {
      userId,
      synced,
      failed,
      total: staleMovies.length,
      updated: updatePromises.length,
    });

    return { synced, failed };
  } catch (error) {
    console.error('Rating sync failed', {
      userId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};
