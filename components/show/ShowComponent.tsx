import React, { Suspense } from 'react';
import Background from '../ui/Background';
import { ShowDetail } from '@/app/types/show';
import ShowDetails from './ShowDetail';
import { CarouselCardsLoader } from '../helpers/Loaders';
import MoreInfo from './MoreInfo';
import Credits from '../ui/Credits';
import Similar from '../ui/Similar';
import Recommended from '../ui/Recommended';
import Seasons from './Seasons';
import { VideoPlayer } from '../ui/VideoPlayer';
import Images from '../movie/Images';
import Reviews from '../movie/Reviews';
import { ListType } from '@/app/types/utils';

const ShowComponent = ({ show, type }: { show: ShowDetail; type: ListType }) => {
  return (
    <section className="w-full h-full relative -mt-[30px]">
      <div className="relative h-[75svh] w-full">
        <Background movie={show} />
        <ShowDetails show={show} />
      </div>
      <div className="flex justify-center flex-col w-full mt-[100px] 3xl:mt-[150px] container gap-3 mx-auto md:gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
          <MoreInfo show={show} />
          <VideoPlayer id={show.id} type={type} />
        </div>
        <Seasons seasons={show.seasons} />

        <div className="flex md:flex-row flex-col md:grid grid-cols-3 gap-3 md:gap-8 mb-[70px]">
          <div className="flex-[7] flex flex-col md:gap-12 gap-6 col-span-2">
            <Suspense fallback={<CarouselCardsLoader title="Cast & Crew" />}>
              <Credits id={show.id} type={type} />
            </Suspense>
            <Suspense fallback={<CarouselCardsLoader title="Similar Movies" />}>
              <Similar id={show.id} type={type} />
            </Suspense>
            <Suspense fallback={<CarouselCardsLoader title="Recommended Movies" />}>
              <Recommended id={show.id} type={type} />
            </Suspense>
          </div>
          <div className="flex-[3] flex flex-col gap-8 md:h-[900px] lg::max-h-[930px] 3xl:max-h-[1125px]">
            <Suspense fallback={<CarouselCardsLoader title="Images" />}>
              <Images id={show.id} type={type} />
            </Suspense>
            <Suspense fallback={<CarouselCardsLoader title="Reviews" />}>
              <Reviews id={show.id} type={type} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowComponent;
