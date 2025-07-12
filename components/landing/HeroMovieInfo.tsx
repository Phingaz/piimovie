'use client';
import { PlayCircleIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Movie } from '@/app/_types/movies';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { imageUrl } from '@/lib/utils';
import Ratings from '../utils/texts/Ratings';
import ReleaseDate from '../utils/texts/ReleaseDate';
import { Show } from '@/app/_types/show';
import { ListType } from '@/app/_types/utils';

const HeroMovieInfo = ({ movie, type }: { type: ListType; movie?: Movie | Show }) => {
  const router = useRouter();

  const title = useMemo(() => (movie ? (movie as Movie).title || (movie as Show).name : ''), [movie]);
  const posterUrl = useMemo(() => imageUrl(movie?.poster_path, 'w780'), [movie]);
  const overview = useMemo(() => movie?.overview || 'No overview available.', [movie]);
  const movieId = useMemo(() => movie?.id, [movie]);
  const releaseDate = useMemo(
    () => (movie ? (movie as Movie).release_date || (movie as Show).first_air_date : ''),
    [movie],
  );

  if (!movie) return null;

  return (
    <div className="bg-gradient-to-b to-black absolute top-0 left-0 w-full min-h-[80svh] md:min-h-[110svh] z-2 flex items-center backdrop-blur-[5px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={movieId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeInOut', duration: 1 }}
          className="w-full flex justify-center absolute top-[35%] md:top-[60%] overflow-visible"
        >
          <div className="w-5xl md:w-7xl flex text-gray-300 drop-shadow-hero">
            <Image
              width={320}
              height={420}
              priority
              alt={title}
              src={posterUrl}
              sizes="(max-width: 768px) 0px, 320px"
              className="rounded-lg border border-gray-500/50 hidden md:block aspect-[3/4] object-center object-cover ml-8 w-[300px] h-[400px]"
            />

            <div className="flex flex-col gap-4 justify-center px-8">
              <motion.h1
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.005 }}
                className="md:text-5xl text-3xl font-bold leading-tighter text-gray-100"
              >
                {title}
              </motion.h1>

              <div className="text-gray-400 font-[500] flex gap-3">
                <Ratings vote_average={movie.vote_average} />
                <ReleaseDate release_date={releaseDate} />
              </div>

              <motion.p
                className="text-[15px] line-clamp-3"
                initial={{ opacity: 0, y: -1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: 'bounce' }}
              >
                {overview}
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3 w-fit justify-center items-center bg-blue-900 text-white px-5 py-3 rounded-md font-bold hover:bg-blue-800 transition-all ease-in-out duration-300 cursor-pointer"
                onClick={() => router.push(`/${type ?? 'movie'}/${movieId}`)}
              >
                <PlayCircleIcon /> Watch Trailer
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroMovieInfo;
