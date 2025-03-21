'use client';
import { useFavoriteCtx } from '@/app/_context/Favorite';
import { authClient } from '@/lib/auth';
import { clientToastError, isFav } from '@/lib/utils';
import { movie } from '@prisma/client';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const Favorite = ({ movie, isLarge = false }: { isLarge?: boolean; movie: movie }) => {
  const { fav, manageFav } = useFavoriteCtx();
  const isFavorite = fav ? isFav(fav, movie.id) : false;
  const { data } = authClient.useSession();
  const user = data && data.user;

  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      event.stopPropagation();

      if (!user) {
        toast.error('Please sign in to manage your favorites movies');
        return;
      }

      await manageFav(movie);
    } catch (error) {
      clientToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={handleClick}
      className={`p-[6px] rounded-[6px] w-fit ${isFavorite ? 'bg-red-100' : 'bg-gray-700/50'} ${
        isLarge ? 'scale-125' : 'scale-90'
      }`}
    >
      <Heart
        size={20}
        fill={isFavorite ? '#c51821' : '#0000'}
        className={`${isFavorite ? 'text-[#c51821]' : 'text-gray-300'} cursor-pointer transition`}
      />
    </motion.button>
  );
};

export default Favorite;
