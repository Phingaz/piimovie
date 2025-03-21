'use client';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { imageUrl } from '@/lib/utils';
import Ratings from '../utils/texts/Ratings';
import Genres from '../utils/texts/Genres';
import Favorite from '../utils/buttons/Favorite';
import Download from '../utils/buttons/Download';
import GoBack from '../utils/buttons/GoBack';
import { ShowDetail } from '@/app/types/show';
import { movie } from '@prisma/client';
import ShowRunTime from './ShowRunTime';
import NumberOfEpisodes from './NumberOfEpisodes';
import NumberOfSeasons from './NumberOfSeasons';

const ShowDetails = ({ show }: { show: ShowDetail }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={show?.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.2 }}
        className="w-full flex justify-center absolute -bottom-[10.5%] overflow-visible bg-gradient-to-b to-black"
      >
        <div className="flex text-gray-300 drop-shadow-hero container">
          <Image
            width={300}
            height={300}
            alt={show.original_name}
            src={imageUrl(show.poster_path)}
            className="rounded-lg h-[400px] aspect-[3/4] object-center object-cover hidden md:block"
          />
          <div className="flex flex-col gap-2 justify-center md:px-8">
            <GoBack />

            <motion.h1
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.005 }}
              className="md:text-5xl text-4xl font-bold leading-tighter text-gray-100 mb-1"
            >
              {show.original_name}
            </motion.h1>
            <p className="text-xl md:text-2xl italic text-gray-300 mb-4">{show.tagline}</p>

            <Genres genres={show.genres} />

            <div className="text-gray-300 font-[500] flex flex-wrap items-center md:gap-5 gap-3 gap-y-[2px] mb-2 mt-2 md:mt-0">
              <Ratings voteCount={show.vote_count} vote_average={show.vote_average} />
              <ShowRunTime first_air_date={show.first_air_date} last_air_date={show.last_air_date} />
              <NumberOfSeasons number_of_seasons={show.number_of_seasons} />
              <NumberOfEpisodes number_of_episodes={show.number_of_episodes} />
            </div>

            <motion.p
              className="text-[15px] line-clamp-3 max-w-2xl"
              initial={{ opacity: 0, y: -1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: 'bounce' }}
            >
              {show.overview}
            </motion.p>

            <div className="flex gap-5 items-center mt-2">
              <Favorite isLarge movie={{ ...show, title: show.original_name } as unknown as movie} />
              <Download title={show.original_name} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShowDetails;
