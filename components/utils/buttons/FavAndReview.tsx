'use client';
import React from 'react';
import Ratings from '../texts/Ratings';
import Favorite from './Favorite';
import { movie } from '@prisma/client';
import { Movie } from '@/app/_types/movies';
import { Show } from '@/app/_types/show';
import { ListType } from '@/app/_types/utils';

const FavAndReview = ({ type, movie, title }: { type: ListType; movie: Movie | Show; title: string }) => {
  return (
    <div className="absolute top-0 right-0 p-2 cursor-pointer z-20 w-full flex justify-between">
      <Ratings showBg isReview vote_average={movie.vote_average} voteCount={movie?.vote_count} />
      <Favorite type={type} movie={{ ...movie, title } as unknown as movie} />
    </div>
  );
};

export default FavAndReview;
