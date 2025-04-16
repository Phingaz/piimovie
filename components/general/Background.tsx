'use client';
import React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { MovieDetail } from '@/app/_types/movies';
import { imageUrl } from '@/lib/utils';
import { ShowDetail } from '@/app/_types/show';

const Background = ({ movie }: { movie: MovieDetail | ShowDetail }) => {
  const title = React.useMemo(() => (movie as MovieDetail).title || (movie as ShowDetail).original_name, [movie]);
  const imageUrlPath = React.useMemo(() => imageUrl(movie.backdrop_path), [movie]);

  return (
    <AnimatePresence mode="wait">
      {movie && (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeInOut', duration: 1 }}
          className="w-full h-full absolute top-0 left-0 overflow-x-clip"
        >
          <motion.div initial={{ x: '0%' }} transition={{ ease: 'linear' }} className="w-full h-full relative">
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
  );
};

export default Background;
