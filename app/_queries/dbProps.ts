'use server';
import db from '@/lib/prisma';
import { User } from 'better-auth';
import { filter, movie } from '@prisma/client';
import { ListType } from '../_types/utils';
import { queryBuilder, PaginationParams } from '@/lib/database-utils';
import { ValidationError, NotFoundError, logger } from '@/lib/logger';

export const getFavorites = async (user: User, paginationParams?: PaginationParams): Promise<movie[] | null> => {
  if (!user) return null;

  if (paginationParams) {
    const result = await queryBuilder.executeWithPagination(
      'getFavorites',
      (skip, take) =>
        db.movie.findMany({
          where: { userId: user.id },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
      () => db.movie.count({ where: { userId: user.id } }),
      paginationParams,
      { userId: user.id },
    );
    // For paginated requests, return just the data array for backward compatibility
    return result.data;
  }

  return await queryBuilder.execute(
    'getFavorites',
    () =>
      db.movie.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
    { userId: user.id },
  );
};

export const addToFavorites = async (type: ListType, movie: movie, user: User) => {
  if (!user || !movie) {
    throw new ValidationError('User and movie are required');
  }

  const { id, poster_path, title, vote_average } = movie;
  const userId = user.id;

  return await queryBuilder.execute(
    'addToFavorites',
    async () => {
      // Check if already exists
      const existing = await db.movie.findFirst({
        where: { id, userId },
      });

      if (existing) {
        logger.warn('Movie already in favorites', { movieId: id, userId });
        return existing;
      }

      return await db.movie.create({
        data: {
          id,
          poster_path,
          type,
          title,
          vote_average,
          userId,
        },
      });
    },
    { movieId: id, userId, type },
  );
};

export const removeFromFavorites = async (id: number, user: User) => {
  if (!id || !user) {
    throw new ValidationError('Movie ID and user are required');
  }

  return await queryBuilder.execute(
    'removeFromFavorites',
    async () => {
      const movie = await db.movie.findFirst({
        where: { id, userId: user.id },
      });

      if (!movie) {
        throw new NotFoundError('Movie not found in favorites');
      }

      return await db.movie.delete({
        where: { id },
      });
    },
    { movieId: id, userId: user.id },
  );
};

export const getFilters = async (user: User, paginationParams?: PaginationParams): Promise<filter[] | null> => {
  if (!user) return null;

  if (paginationParams) {
    const result = await queryBuilder.executeWithPagination(
      'getFilters',
      (skip, take) =>
        db.filter.findMany({
          where: { userId: user.id },
          skip,
          take,
          orderBy: { lastUsed: 'desc' },
        }),
      () => db.filter.count({ where: { userId: user.id } }),
      paginationParams,
      { userId: user.id },
    );
    // For paginated requests, return just the data array for backward compatibility
    return result.data;
  }

  return await queryBuilder.execute(
    'getFilters',
    () =>
      db.filter.findMany({
        where: { userId: user.id },
        orderBy: { lastUsed: 'desc' },
      }),
    { userId: user.id },
  );
};

export const addFilter = async (filter: filter, user: User) => {
  if (!user || !filter) return null;

  await db.filter.create({
    data: { ...filter, userId: user.id },
  });
};

export const deleteFilter = async (id: filter['id'], user: User) => {
  if (!id || !user) return null;
  await db.filter.delete({ where: { id } });
};

export const addToFilterFavorites = async (filter: filter, user: User) => {
  if (!user || !filter) return null;

  await db.filter.update({
    where: { id: filter.id },
    data: { isFavorite: true },
  });
};

export const removeFromFilterFavorites = async (id: filter['id'], user: User) => {
  if (!id || !user) return null;

  await db.filter.update({
    where: { id },
    data: { isFavorite: false },
  });
};

export const updateFilterLastUsedTime = async (id: filter['id'], user: User) => {
  if (!id || !user) return null;
  await db.filter.update({
    where: { id },
    data: { lastUsed: new Date() },
  });
};

export const getFeatureFlags = async () => {
  return await db.feature_flags.findMany();
};

export const addFeatureFlag = async (name: string) => {
  if (!name) return null;
  return await db.feature_flags.create({
    data: { name: name.replace(/\s+/g, '') },
  });
};

export const toggleFeatureFlag = async (id: string) => {
  if (!id) return null;
  const featureFlag = await db.feature_flags.findFirst({ where: { id } });
  if (!featureFlag) return null;

  return await db.feature_flags.update({
    where: { id: featureFlag.id },
    data: { enabled: !featureFlag.enabled },
  });
};

export const deleteFeatureFlag = async (id: string) => {
  if (!id) return null;
  return await db.feature_flags.delete({ where: { id } });
};

// Paginated versions that return full pagination metadata
export const getFavoritesPaginated = async (user: User, paginationParams: PaginationParams) => {
  if (!user) return null;

  return await queryBuilder.executeWithPagination(
    'getFavoritesPaginated',
    (skip, take) =>
      db.movie.findMany({
        where: { userId: user.id },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    () => db.movie.count({ where: { userId: user.id } }),
    paginationParams,
    { userId: user.id },
  );
};

export const getFiltersPaginated = async (user: User, paginationParams: PaginationParams) => {
  if (!user) return null;

  return await queryBuilder.executeWithPagination(
    'getFiltersPaginated',
    (skip, take) =>
      db.filter.findMany({
        where: { userId: user.id },
        skip,
        take,
        orderBy: { lastUsed: 'desc' },
      }),
    () => db.filter.count({ where: { userId: user.id } }),
    paginationParams,
    { userId: user.id },
  );
};
