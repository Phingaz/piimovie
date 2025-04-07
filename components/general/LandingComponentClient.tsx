'use client';
import React from 'react';
import HeroMovieImg from '../landing/HeroMovieImage';
import HeroMovieInfo from '../landing/HeroMovieInfo';
import { Movie } from '@/app/types/movies';
import { Show } from '@/app/types/show';
import useHero from '@/app/_hooks/useHero';
import { ListType } from '@/app/types/utils';

const LandingComponentClient = ({ type, items }: { type: ListType; items: Movie[] | Show[] }) => {
  const { movie, time, direction, intervalTime } = useHero(items);

  if (!movie) return null;

  return (
    <div className="relative">
      <HeroMovieImg movie={movie} time={time} direction={direction} intervalTime={intervalTime} />
      <HeroMovieInfo type={type} movie={movie} />
    </div>
  );
};

export default LandingComponentClient;
