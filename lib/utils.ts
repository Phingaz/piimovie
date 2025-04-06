import { Movie, MovieCategory } from '@/app/types/movies';
import { Show, ShowCategory } from '@/app/types/show';
import { movie } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { TransitionStartFunction } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { MovieCategoryEnum, ShowCategoryEnum } from './enums';
import { FilterOption } from '@/app/types/utils';
import { format, parseISO } from 'date-fns';

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

export function getRandomMovie(movies: Movie[] | Show[] | undefined) {
  if (!movies) return null;

  const random = Math.floor(Math.random() * 20);
  return movies[random];
}

export const getRandomNumber = (range: number) => Math.floor(Math.random() * range) + 1;

export const getRandomMovieCategory = (): MovieCategory => {
  const MovieCategorys = Object.keys(MovieCategoryEnum);
  return MovieCategorys[Math.floor(Math.random() * MovieCategorys.length)] as unknown as MovieCategory;
};

export const getRandomShowCategory = (): ShowCategory => {
  const MovieCategorys = Object.keys(ShowCategoryEnum);
  return MovieCategorys[Math.floor(Math.random() * MovieCategorys.length)] as unknown as ShowCategory;
};

export const cleanDate = (date: string) => format(parseISO(date), 'MMMM d, yyyy');
export const formatDate = (release_date: string) => format(parseISO(release_date), 'MMM d, yyyy');

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

export const isFav = (favMovies: movie[], id: number) => favMovies?.some((favMovie) => favMovie.id === id);

export const imageUrl = (imgUrl?: string) => {
  return imgUrl ? `https://image.tmdb.org/t/p/original/${imgUrl}` : '/placeholder.png';
};

export const imageCardUrl = (imgUrl?: string) => {
  return imgUrl ? `https://image.tmdb.org/t/p/w500/${imgUrl}` : '/placeholder.png';
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

export const getBaseParams = (data: FilterOption) => {
  const {
    page = 1,
    sort_by,
    include_adult,
    'vote_average.gte': vote_average,
    'vote_count.gte': vote_count,
    'release_date.gte': release_date_gte,
    'release_date.lte': release_date_lte,
    'primary_release_date.gte': primary_release_date_gte,
    'primary_release_date.lte': primary_release_date_lte,
    'air_date.gte': air_date_gte,
    'air_date.lte': air_date_lte,
    'first_air_date.gte': first_air_date_gte,
    'first_air_date.lte': first_air_date_lte,
    with_release_type,
    with_origin_country,
    with_original_language,
    without_genres,
    with_genres,
    year,
  } = data;

  const baseParams = {
    language: 'en-US',
    page: page.toString(),
    ...(sort_by && { sort_by }),
    ...(include_adult !== undefined && { include_adult: include_adult.toString() }),
    ...(vote_average && { 'vote_average.gte': vote_average.toString() }),
    ...(vote_count && { 'vote_count.gte': vote_count.toString() }),
    ...(release_date_gte && { 'release_date.gte': release_date_gte }),
    ...(release_date_lte && { 'release_date.lte': release_date_lte }),
    ...(primary_release_date_gte && { 'primary_release_date.gte': primary_release_date_gte }),
    ...(primary_release_date_lte && { 'primary_release_date.lte': primary_release_date_lte }),
    ...(air_date_gte && { 'air_date.gte': air_date_gte }),
    ...(air_date_lte && { 'air_date.lte': air_date_lte }),
    ...(first_air_date_gte && { 'first_air_date.gte': first_air_date_gte }),
    ...(first_air_date_lte && { 'first_air_date.lte': first_air_date_lte }),
    ...(with_release_type && { with_release_type }),
    ...(with_origin_country && { with_origin_country }),
    ...(with_original_language && { with_original_language }),
    ...(without_genres && { without_genres }),
    ...(year && { year }),
    ...(with_genres && { with_genres }),
  };

  return baseParams;
};
