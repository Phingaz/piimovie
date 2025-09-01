'use server';
import db from '@/lib/prisma';
import { User } from 'better-auth';
import { filter, movie } from '@prisma/client';
import { ListType } from '../_types/utils';
import { LocalWebhookConfig } from '@/components/modals/WebhookConfigModal';

export const getFavorites = async (user: User) => {
  if (!user) return null;
  return await db.movie.findMany({ where: { userId: user.id } });
};

export const addToFavorites = async (type: ListType, movie: movie, user: User) => {
  if (!user || !movie) return null;

  const { id, poster_path, title, vote_average } = movie;
  const userId = user.id;

  await db.movie.create({
    data: {
      id,
      poster_path,
      type,
      title,
      vote_average,
      userId,
    },
  });
};

export const removeFromFavorites = async (id: number, user: User) => {
  if (!id || !user) return;
  await db.movie.delete({ where: { id } });
};

export const getFilters = async (user: User) => {
  if (!user) return null;
  return await db.filter.findMany({ where: { userId: user.id }, orderBy: { lastUsed: 'desc' } });
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

export const getWebhookConfig = async (user: User) => {
  if (!user) return null;
  return await db.webhookConfig.findMany({ where: { userId: user.id } });
};

export const addWebhookConfig = async (config: LocalWebhookConfig, user: User) => {
  if (!user || !config) return null;

  await db.webhookConfig.create({
    data: {
      url: config.url,
      userId: user.id,
      sendAlways: config.sendAlways,
      isJellyseerr: config.isJellyseerr,
      headers: JSON.stringify(config.headers),
    },
  });
};

export const deleteWebhookConfig = async (userId: string | undefined, id: string) => {
  if (!userId || !id) return null;
  await db.webhookConfig.deleteMany({ where: { userId, id } });
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
