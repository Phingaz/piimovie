'use client';
import React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Movie } from '@/app/types/movies';
import { imageUrl } from '@/lib/utils';
import useHero from '@/app/_hooks/useHero';
import { Show } from '@/app/types/show';

const HeroMovieImg = ({ items }: { items?: Movie[] | Show[] }) => {
  const { movie, time, direction, intervalTime } = useHero(items);
  const title = React.useMemo(() => (movie as Movie).title || (movie as Show).original_name, [movie]);
  const imageUrlPath = React.useMemo(() => imageUrl(movie?.backdrop_path), [movie]);

  if (!movie) return null;

  return (
    <div className="w-full h-[80svh] md:h-[100svh] bg-black relative overflow-clip">
      <AnimatePresence mode="wait">
        {movie && (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.5 }}
            className="w-full h-full absolute top-0 left-0"
          >
            <motion.div
              initial={{ x: '0%' }}
              animate={{
                x: direction === 'left' ? ['0%', `-10%`] : ['0%', `10%`],
                transition: {
                  ease: 'linear',
                  duration: (time * intervalTime) / 1000,
                  repeat: Infinity,
                },
              }}
              className="w-full h-full relative"
            >
              <Image
                fill
                priority
                alt={title}
                src={imageUrlPath}
                className="scale-[1.2] object-top object-cover w-full h-full absolute"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroMovieImg;
