'use client';
import React from 'react';
import Ratings from '../texts/Ratings';
import Favorite from './Favorite';
import { movie } from '@prisma/client';
import { Movie } from '@/app/_types/movies';
import { Show } from '@/app/_types/show';
import { ListType } from '@/app/_types/utils';
import Download from './Download';

const FavAndReview = ({ type, movie, title }: { type: ListType; movie: Movie | Show; title: string }) => {
  return (
    <div className="absolute top-0 right-0 p-2 cursor-pointer z-20 w-full flex flex-col justify-between items-end gap-1">
      <Ratings showBg isReview vote_average={movie.vote_average} voteCount={movie?.vote_count} />
      <div className="flex items-center gap-2">
        <Download isLarge={false} title={title} />
        <Favorite type={type} movie={{ ...movie, title } as unknown as movie} />
      </div>
    </div>
  );
};

export default FavAndReview;
