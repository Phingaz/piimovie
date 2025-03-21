'use client';
import { getRandomMovie, imageUrl, preloadImage } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Movie } from '../types/movies';
import { Show } from '../types/show';

const time = 20;
const intervalTime = 500;

const useHero = (movies?: Movie[] | Show[]) => {
  const [movie, setMovie] = useState<Movie | Show | null>(() => getRandomMovie(movies));
  const [nextMovie, setNextMovie] = useState<Movie | Show | null>(() => getRandomMovie(movies));
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    if (movies?.length === 0) return;

    if (nextMovie?.backdrop_path) {
      preloadImage(imageUrl(nextMovie.backdrop_path));
    }
    if (nextMovie?.poster_path) {
      preloadImage(imageUrl(nextMovie.poster_path));
    }

    const interval = setInterval(() => {
      setDirection((prev) => (prev === 'right' ? 'left' : 'right'));
      setMovie(nextMovie);

      let newMovie: Movie | Show | null = null;
      let attempts = 0;

      while (movies && attempts < movies.length) {
        newMovie = getRandomMovie(movies);
        if (newMovie?.id !== nextMovie?.id) break;
        attempts++;
      }

      setNextMovie(newMovie);
    }, intervalTime * time);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies]);

  return { time, movie, direction, intervalTime };
};

export default useHero;
