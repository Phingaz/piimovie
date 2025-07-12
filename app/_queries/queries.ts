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
import { User } from 'better-auth';
import { logger } from '@/lib/logger';
import db from '@/lib/prisma';

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

export interface SyncOptions {
  maxAge?: number;
  batchSize?: number;
}

export const syncUserMovieRatings = async (
  user: User,
  options: SyncOptions = {},
): Promise<{ synced: number; failed: number }> => {
  if (!user) {
    throw new Error('User is required for rating sync');
  }

  const { maxAge = 24, batchSize = 10 } = options;
  const maxAgeMs = maxAge * 60 * 60 * 1000;
  const cutoffTime = new Date(Date.now() - maxAgeMs);

  try {
    // Get movies that need rating updates
    const staleMovies = await db.movie.findMany({
      where: {
        userId: user.id,
        lastRatingSync: {
          lt: cutoffTime,
        },
      },
      take: batchSize,
      orderBy: {
        lastRatingSync: 'asc', // Oldest first
      },
    });

    if (staleMovies.length === 0) {
      logger.info('No movies need rating sync', { userId: user.id });
      return { synced: 0, failed: 0 };
    }

    logger.info(`Syncing ratings for ${staleMovies.length} movies`, {
      userId: user.id,
      movieCount: staleMovies.length,
    });

    let synced = 0;
    let failed = 0;

    // Process movies in smaller batches to avoid overwhelming TMDB API
    for (const movie of staleMovies) {
      try {
        // Fetch current movie data from TMDB
        const response = await getDetails({
          id: movie.id.toString(),
          type: movie.type as 'movie' | 'tv',
        });

        if (!response.data) {
          logger.warn('Failed to fetch movie data from TMDB', {
            movieId: movie.id,
            userId: user.id,
          });
          failed++;
          continue;
        }

        const tmdbData = response.data;

        // Update the movie with fresh TMDB data
        await db.movie.update({
          where: { id: movie.id },
          data: {
            vote_average: Math.round(tmdbData.vote_average || 0), // Keep as Int for now
            lastRatingSync: new Date(),
          },
        });

        synced++;
        logger.debug('Synced movie rating', {
          movieId: movie.id,
          title: movie.title,
          oldRating: movie.vote_average,
          newRating: Math.round(tmdbData.vote_average || 0),
          userId: user.id,
        });
      } catch (error) {
        logger.error('Failed to sync movie rating', {
          movieId: movie.id,
          userId: user.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        failed++;
      }

      // Small delay to respect TMDB rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    logger.info('Rating sync completed', {
      userId: user.id,
      synced,
      failed,
      total: staleMovies.length,
    });

    return { synced, failed };
  } catch (error) {
    logger.error('Rating sync failed', {
      userId: user.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

export const getSyncStats = async (user: User) => {
  if (!user) return null;

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [total, needsSync, recentlySync] = await Promise.all([
    db.movie.count({ where: { userId: user.id } }),
    db.movie.count({
      where: {
        userId: user.id,
        lastRatingSync: { lt: oneDayAgo },
      },
    }),
    db.movie.count({
      where: {
        userId: user.id,
        lastRatingSync: { gte: oneDayAgo },
      },
    }),
  ]);

  return {
    total,
    needsSync,
    recentlySync,
    syncPercentage: total > 0 ? Math.round((recentlySync / total) * 100) : 0,
  };
};
