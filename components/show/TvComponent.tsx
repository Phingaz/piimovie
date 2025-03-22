import React from 'react';
import { ListType } from '@/app/types/utils';
import { getListing } from '@/app/queries/queries';
import { getRandomNumber, getRandomShowCategory } from '@/lib/utils';
import HeroMovieImg from '../landing/HeroMovieImage';
import HeroMovieInfo from '../landing/HeroMovieInfo';
import LandingListingWrapper from '../landing/LadingListingWrapper';
import { Show } from '@/app/types/show';
import ErrorPageComponent from '../helpers/Error';

const TvComponent = async ({ type }: { type: ListType }) => {
  try {
    const result = await getListing({ page: getRandomNumber(10), category: getRandomShowCategory(), type });

    if (!result.success) throw new Error(result.message);

    const movies = result.data?.results as Show[];

    return (
      <section>
        <div className="relative">
          <HeroMovieImg items={movies} />
          <HeroMovieInfo type={type} items={movies} />
        </div>
        <LandingListingWrapper type={type} />
      </section>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
};

export default TvComponent;
