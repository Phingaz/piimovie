import React, { Suspense } from 'react';
import LandingListing from './LandingList';
import { CarouselCardsLoader } from '../helpers/Loaders';

const LadingListingWrapper = () => {
  return (
    <div className="md:mt-[230px] 3xl:mt-[120px] max-w-[1350px] 3xl:max-w-[1750px] px-8 mx-auto">
      <Suspense fallback={<CarouselCardsLoader title="Now playing" />}>
        <LandingListing type="now_playing" />
      </Suspense>
      <Suspense fallback={<CarouselCardsLoader title="Popular" />}>
        <LandingListing type="popular" />
      </Suspense>
      <Suspense fallback={<CarouselCardsLoader title="Upcoming" />}>
        <LandingListing type="upcoming" />
      </Suspense>
      <Suspense fallback={<CarouselCardsLoader title="Top Rated" />}>
        <LandingListing type="top_rated" />
      </Suspense>
    </div>
  );
};

export default LadingListingWrapper;
