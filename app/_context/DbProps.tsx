'use client';
import React, { createContext } from 'react';
import {
  addFilter,
  addToFavorites,
  addToFilterFavorites,
  deleteFilter,
  removeFromFavorites,
  removeFromFilterFavorites,
  updateFilterLastUsedTime,
} from '../_queries/dbProps';
import { toast } from 'sonner';
import { feature_flags, filter, movie, WebhookConfig } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useMainCtx } from './Main';
import { ListType, ProviderProps } from '../_types/utils';
import { useWebhook } from '../_hooks/useWebhook';

export type TDbPropsCtx = {
  fav: movie[] | null;
  isSuperAdmin: boolean;
  filters: filter[] | null;
  featureFlags: feature_flags[] | null;
  webhookConfig: WebhookConfig[] | null;
  manageFav: (movie: movie, type: ListType) => Promise<void>;
  addToFilter: (filter: filter) => Promise<void>;
  removeFromFilter: (filter: filter) => Promise<void>;
  toggleFilterFavorite: (filter: filter) => Promise<void>;
  updateFilterLastUsed: (id: string) => Promise<void>;
};

const DbPropsCtx = createContext<TDbPropsCtx | undefined>(undefined);

export type DbPropsCtxProviderProps = {
  children: React.ReactNode;
  value: ProviderProps;
};

export function DbPropsCtxProvider({ children, value }: DbPropsCtxProviderProps) {
  const { fav, filters, webhookConfig } = value;
  const { user } = useMainCtx();
  const router = useRouter();
  const sendWebhook = useWebhook(webhookConfig);

  const manageFav = async (movie: movie, type: ListType) => {
    if (!user) {
      toast.error('Please sign in to perform this action');
      return;
    }

    const isFav = fav?.find((favMovie) => favMovie.id === movie.id);

    if (!isFav) {
      await addToFavorites(type, movie, user);
      toast.success('Added to favorites successfully');
      await sendWebhook(movie, type, true);
    } else {
      await removeFromFavorites(movie.id, user);
      toast.success('Removed to favorites successfully');
      await sendWebhook(movie, type, false);
    }

    router.refresh();
  };

  const toggleFilterFavorite = async (filter: filter) => {
    if (!user) {
      toast.error('Please sign in to perform this action');
      return;
    }

    const isFav = (filters ?? []).find((el) => el.id === filter.id && el.isFavorite);

    if (!isFav) {
      await addToFilterFavorites(filter, user);
      toast.success('Added to favorites successfully');
    } else {
      await removeFromFilterFavorites(filter.id, user);
      toast.success('Removed from favorites successfully');
    }

    router.refresh();
  };

  const addToFilter = async (filter: filter) => {
    if (!user) {
      toast.error('Please sign in to perform this action');
      return;
    }

    await addFilter(filter, user);
    toast.success('Filter added successfully');
    router.refresh();
  };

  const removeFromFilter = async (filter: filter) => {
    if (!user) {
      toast.error('Please sign in to perform this action');
      return;
    }

    await deleteFilter(filter.id, user);
    toast.success('Filter removed successfully');
    router.refresh();
  };

  const updateFilterLastUsed = async (id: string) => {
    if (!user) {
      toast.error('Please sign in to perform this action');
      return;
    }

    await updateFilterLastUsedTime(id, user);
    router.refresh();
  };

  const contextValue = {
    ...value,
    fav,
    filters,
    manageFav,
    addToFilter,
    removeFromFilter,
    updateFilterLastUsed,
    toggleFilterFavorite,
  };

  return <DbPropsCtx.Provider value={contextValue}>{children}</DbPropsCtx.Provider>;
}

export const useDbPropsCtx = () => {
  const context = React.useContext(DbPropsCtx);
  if (!context) throw new Error('useDbPropsCtx must be used within a DbPropsCtxProvider');
  return context;
};

export default DbPropsCtx;
