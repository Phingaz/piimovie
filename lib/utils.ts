import { Movie, MovieType, MovieTypeEnum } from '@/app/types';
import { movie } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { TransitionStartFunction } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const clientToastError = (error: unknown) => {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unknown error occurred');
  }
};

export const preloadImage = (url: string) => {
  if (url) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  }
};

export function getRandomMovie(movies: Movie[] | undefined) {
  if (!movies) return null;

  const random = Math.floor(Math.random() * 20);
  return movies[random];
}

export const getRandomNumber = (range: number) => {
  return Math.floor(Math.random() * range) + 1;
};

export const getRandomType = (): MovieType => {
  const movieTypes = Object.keys(MovieTypeEnum);
  return movieTypes[Math.floor(Math.random() * movieTypes.length)] as unknown as MovieType;
};

export const cleanDate = (date: string) => {
  const dateObject = new Date(date);
  const formattedDate = dateObject.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return formattedDate;
};

export const runTimeInHourAndMin = (runtime: number) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours}h ${minutes}m`;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatDate = (release_date: string) => {
  const d = new Date(release_date);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const isFav = (favMovies: movie[], id: number) => {
  return favMovies?.some((favMovie) => favMovie.id === id);
};

export const imageUrl = (imgUrl: string) => {
  return `https://image.tmdb.org/t/p/original/${imgUrl}`;
};

export const imageCardUrl = (imgUrl: string) => {
  return `https://image.tmdb.org/t/p/w500/${imgUrl}`;
};

export const updateSearchParam = ({
  param,
  searchParams,
  router,
  startTransition,
}: {
  param: Record<string, string | null>;
  searchParams: URLSearchParams;
  router: AppRouterInstance;
  startTransition: TransitionStartFunction;
}) => {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(param).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });

  startTransition(() => router.push(`?${params.toString()}`, { scroll: false }));
};
