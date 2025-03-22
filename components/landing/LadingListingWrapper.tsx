import React, { Suspense } from 'react';
import LandingListing from './LandingList';
import { CarouselCardsLoader } from '../helpers/Loaders';
import { MovieCategory } from '@/app/types/movies';
import { ShowCategory } from '@/app/types/show';
import { ListType } from '@/app/types/utils';

const LandingListingWrapper = ({ type }: { type: ListType }) => {
  const categories: { type: string; loader: string; category: MovieCategory | ShowCategory }[] =
    type === 'movie'
      ? [
          { loader: 'Now Playing', category: 'now_playing', type: 'movie' },
          { loader: 'Popular', category: 'popular', type: 'movie' },
          { loader: 'Upcoming', category: 'upcoming', type: 'movie' },
          { loader: 'Top Rated', category: 'top_rated', type: 'movie' },
        ]
      : [
          { loader: 'Top Rated', category: 'top_rated', type: 'show' },
          { loader: 'Airing Today', category: 'airing_today', type: 'show' },
          { loader: 'On The Air', category: 'on_the_air', type: 'show' },
          { loader: 'Popular', category: 'popular', type: 'show' },
        ];

  return (
    <div className="mt-[40px] md:mt-[230px] 3xl:mt-[150px] container mx-auto">
      {categories.map(({ loader, category }, index) => (
        <Suspense key={index} fallback={<CarouselCardsLoader title={loader} />}>
          <LandingListing type={type} category={category} />
        </Suspense>
      ))}
    </div>
  );
};

export default LandingListingWrapper;
