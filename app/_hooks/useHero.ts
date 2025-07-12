'use client';
import { getRandomMovie, imageUrl } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Movie } from '../_types/movies';
import { Show } from '../_types/show';
import { preloadCriticalImages } from '@/lib/image-preload-service';

const time = 20;
const intervalTime = 500;

const useHero = (movies?: Movie[] | Show[]) => {
  const [movie, setMovie] = useState<Movie | Show | null>(() => getRandomMovie(movies));
  const [nextMovie, setNextMovie] = useState<Movie | Show | null>(() => getRandomMovie(movies));
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    if (!movies?.length) return;

    const imagesToPreload = [];

    if (nextMovie?.backdrop_path) {
      imagesToPreload.push({
        url: imageUrl(nextMovie.backdrop_path, 'w1280'),
        sizes: '100vw',
      });
    }

    if (nextMovie?.poster_path) {
      imagesToPreload.push({
        url: imageUrl(nextMovie.poster_path, 'w780'),
        sizes: '(max-width: 768px) 0px, 320px',
      });
    }

    if (imagesToPreload.length > 0) {
      preloadCriticalImages(imagesToPreload);
    }

    const interval = setInterval(() => {
      setDirection((prev) => (prev === 'right' ? 'left' : 'right'));
      setMovie(nextMovie);

      setNextMovie((prevNextMovie) => {
        let newMovie: Movie | Show | null = null;
        let attempts = 0;

        while (movies && attempts < movies.length) {
          newMovie = getRandomMovie(movies);
          if (newMovie?.id !== prevNextMovie?.id) break;
          attempts++;
        }

        return newMovie;
      });
    }, intervalTime * time);

    return () => clearInterval(interval);
  }, [movies, nextMovie]);

  return { time, movie, direction, intervalTime };
};

export default useHero;
