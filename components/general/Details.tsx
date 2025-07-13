'use client';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MovieDetail } from '@/app/_types/movies';
import Image from 'next/image';
import { imageUrl } from '@/lib/utils';
import Ratings from '../utils/texts/Ratings';
import ReleaseDate from '../utils/texts/ReleaseDate';
import RunTimeDetails from '../utils/texts/RunTime';
import Genres from '../utils/texts/Genres';
import Favorite from '../utils/buttons/Favorite';
import Download from '../utils/buttons/Download';
import GoBack from '../utils/buttons/GoBack';
import { movie } from '@prisma/client';
import { ListType } from '@/app/_types/utils';
import HQBadge from '../ui/HQBadge';
import { useHQStatus } from '@/app/_hooks/useHQStatus';

const Details = ({ movie }: { type: ListType; movie: MovieDetail }) => {
  const { hqStatus, loading } = useHQStatus(movie.title);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={movie?.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.2 }}
        className="w-full flex justify-center absolute -bottom-[10.5%] overflow-visible bg-gradient-to-b to-black"
      >
        <div className="flex text-gray-300 drop-shadow-hero container">
          <div className="relative flex-shrink-0 mr-5 md:mr-8">
            <Image
              width={300}
              height={400}
              priority
              alt={movie.title}
              src={imageUrl(movie.poster_path, 'w780')}
              sizes="(max-width: 768px) 0px, 300px"
              className="rounded-lg h-[400px] aspect-[3/4] object-center object-cover hidden md:block"
            />
            <HQBadge hasHQ={hqStatus} loading={loading} />
          </div>
          <div className="flex flex-col gap-2 justify-center md:px-8">
            <GoBack />

            <motion.h1
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.005 }}
              className="md:text-5xl text-4xl font-bold leading-tighter text-gray-100 mb-1"
            >
              {movie?.title}
            </motion.h1>

            <Genres genres={movie.genres} />

            <div className="text-gray-300 font-[500] flex flex-wrap items-center md:gap-5 gap-3 gap-y-[2px] mb-2 mt-2 md:mt-0">
              <Ratings voteCount={movie.vote_count} vote_average={movie.vote_average} />
              <RunTimeDetails runtime={movie.runtime} />
              <ReleaseDate release_date={movie.release_date} />
            </div>

            <motion.p
              className="text-[15px] line-clamp-3 max-w-2xl"
              initial={{ opacity: 0, y: -1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: 'spring' }}
            >
              {movie?.overview}
            </motion.p>

            <div className="flex gap-5 items-center mt-2">
              <Favorite type="movie" isLarge movie={movie as unknown as movie} />
              <Download title={movie.title} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Details;
