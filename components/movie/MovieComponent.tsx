import React, { Suspense } from 'react';
import { MovieDetail } from '@/app/types/movies';
import Details from './Details';
import Background from './Background';
import { VideoPlayer } from './VideoPlayer';
import Credits from './Credits';
import { CarouselCardsLoader } from '../helpers/Loaders';
import Images from './Images';
import MovieKeywords from './Keywords';
import Similar from './Similar';
import Recommended from './Recommended';
import MoreInfo from './MoreInfo';
import Reviews from './Reviews';

const MovieComponent = ({ movie }: { movie: MovieDetail }) => {
  return (
    <section className="w-full h-full relative -mt-[30px]">
      <div className="relative h-[75svh] w-full">
        <Background movie={movie} />
        <Details movie={movie} />
      </div>
      <div className="flex justify-center w-full mt-[100px] 3xl:mt-[150px]">
        <div className="container flex md:flex-row flex-col md:grid grid-cols-3 gap-3 md:gap-8 mb-[70px]">
          <div className="flex-[7] flex flex-col md:gap-12 gap-6 col-span-2">
            <MoreInfo movie={movie} />
            <Suspense fallback={<CarouselCardsLoader title="Cast & Crew" />}>
              <Credits id={movie.id} />
            </Suspense>
            <Suspense fallback={<CarouselCardsLoader title="Similar Movies" />}>
              <Similar id={movie.id} />
            </Suspense>
            <Suspense fallback={<CarouselCardsLoader title="Recommended Movies" />}>
              <Recommended id={movie.id} />
            </Suspense>
          </div>
          <div className="flex-[3] flex flex-col gap-8 md:max-h-[1170px] 3xl:max-h-[1390px]">
            <VideoPlayer id={movie.id} />
            <Suspense fallback={<CarouselCardsLoader title="Images" />}>
              <Images id={movie.id} />
            </Suspense>
            <MovieKeywords id={movie.id} />
            <Suspense fallback={<CarouselCardsLoader title="Reviews" />}>
              <Reviews id={movie.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieComponent;
