import { Movie, MovieType, MovieTypeEnum } from '@/app/types';
import { type ClassValue, clsx } from 'clsx';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { TransitionStartFunction } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const logger = (message?: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] - ${message || 'Error message is empty'}`);
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

export const isFav = (favMovies: Movie[], id: number) => {
  return favMovies?.some((favMovie) => favMovie.id === id);
};

export const imageUrl = (imgUrl: string) => {
  return `https://image.tmdb.org/t/p/original/${imgUrl}`;
};

export const imageCardUrl = (imgUrl: string) => {
  return `https://image.tmdb.org/t/p/w500/${imgUrl}`;
};

export const serverResult = <T>(data: T, message = 'Successfully fetched data') => {
  logger(message);
  return { data, success: true, message };
};

export function catchError(error: unknown) {
  let status_message = 'An unknown error occurred';
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    status_message = error.message;
    console.error(`[${timestamp}] - ${error}`);
  } else {
    console.error(error);
  }
  return { success: false, message: status_message, data: null };
}

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
