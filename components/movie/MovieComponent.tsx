import React, { Suspense } from 'react';
import { MovieDetail } from '@/app/types/movies';
import Details from '../ui/Details';
import Background from '../ui/Background';
import { VideoPlayer } from '../ui/VideoPlayer';
import Credits from '../ui/Credits';
import { CarouselCardsLoader } from '../helpers/Loaders';
import Images from './Images';
import Keywords from './Keywords';
import Similar from '../ui/Similar';
import Recommended from '../ui/Recommended';
import MoreInfo from './MoreInfo';
import Reviews from './Reviews';
import { ListType } from '@/app/types/utils';

const MovieComponent = ({ movie, type }: { movie: MovieDetail; type: ListType }) => {
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
              <Credits id={movie.id} type={type} />
            </Suspense>
            <Suspense fallback={<CarouselCardsLoader title="Similar Movies" />}>
              <Similar id={movie.id} type={type} />
            </Suspense>
            <Suspense fallback={<CarouselCardsLoader title="Recommended Movies" />}>
              <Recommended id={movie.id} type={type} />
            </Suspense>
          </div>
          <div className="flex-[3] flex flex-col gap-8 md:max-h-[1170px] 3xl:max-h-[1390px]">
            <VideoPlayer id={movie.id} type={type} />
            <Suspense fallback={<CarouselCardsLoader title="Images" />}>
              <Images id={movie.id} type={type} />
            </Suspense>
            <Keywords id={movie.id} type={type} />
            <Suspense fallback={<CarouselCardsLoader title="Reviews" />}>
              <Reviews id={movie.id} type={type} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieComponent;
