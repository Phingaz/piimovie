'use client';
import React, { createContext } from 'react';
import { addToFavorites, removeFromFavorites } from '../queries/favorites';
import { toast } from 'sonner';
import { movie } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useMainCtx } from './Main';

export type TFavoriteCtx = {
  fav: movie[] | null;
  manageFav: (movie: movie) => Promise<void>;
};

const FavoriteCtx = createContext<TFavoriteCtx | undefined>(undefined);

type FavoriteCtxProviderProps = {
  children: React.ReactNode;
  fav: movie[] | null;
};

export function FavoriteCtxProvider({ children, fav }: FavoriteCtxProviderProps) {
  const { user } = useMainCtx();
  const router = useRouter();

  const manageFav = async (movie: movie) => {
    if (!user) {
      toast.error('Please sign in to perform this action');
      return;
    }

    const isFav = fav?.find((favMovie) => favMovie.id === movie.id);

    if (!isFav) {
      await addToFavorites(movie, user);
      toast.success('Added to favorites successfully');
    } else {
      await removeFromFavorites(movie.id);
      toast.success('Removed to favorites successfully');
    }

    router.refresh();
  };

  const contextValue = { fav, manageFav };

  return <FavoriteCtx.Provider value={contextValue}>{children}</FavoriteCtx.Provider>;
}

export const useFavoriteCtx = () => {
  const context = React.useContext(FavoriteCtx);
  if (!context) throw new Error('useFavoriteCtx must be used within a FavoriteCtxProvider');
  return context;
};

export default FavoriteCtx;
