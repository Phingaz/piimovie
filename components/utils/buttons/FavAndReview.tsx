import React from 'react';
import Ratings from '../texts/Ratings';
import Favorite from './Favorite';
import { movie } from '@prisma/client';
import { Movie } from '@/app/types/movies';

const FavAndReview = ({ movie }: { movie: Movie }) => {
  return (
    <div className="absolute top-0 right-0 p-2 cursor-pointer z-20 w-full flex justify-between">
      <Ratings showBg isReview vote_average={movie.vote_average} />
      <Favorite movie={movie as unknown as movie} />
    </div>
  );
};

export default FavAndReview;
