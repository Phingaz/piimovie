'use client';
import { useFavoriteCtx } from '@/app/_context/Favorite';
import { Movie } from '@/app/types';
import { isFav } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import React from 'react';

const Favorite = ({ movie, isLarge = false }: { isLarge?: boolean; movie: Movie }) => {
  const { favMovies, manageFav } = useFavoriteCtx();
  const isFavorite = isFav(favMovies, movie.id);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    manageFav(movie);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={handleClick}
      className={`p-[6px] rounded-md w-fit ${isFavorite ? 'bg-red-100' : 'bg-gray-700/50'} ${
        isLarge ? 'scale-125' : 'scale-90'
      }`}
    >
      <Heart
        size={20}
        fill={isFavorite ? '#c51821' : '#0000'}
        className={`${isFavorite ? 'text-red-accent' : 'text-gray-300'} cursor-pointer transition`}
      />
    </motion.button>
  );
};

export default Favorite;
