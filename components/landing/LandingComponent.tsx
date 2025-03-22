import React from 'react';
import HeroMovieImg from './HeroMovieImage';
import HeroMovieInfo from './HeroMovieInfo';
import LandingListingWrapper from './LadingListingWrapper';
import { ListType } from '@/app/types/utils';
import { getListing } from '@/app/queries/queries';
import { getRandomMovieCategory, getRandomNumber } from '@/lib/utils';
import { Movie } from '@/app/types/movies';
import ErrorPageComponent from '../helpers/Error';

const LandingComponent = async ({ type }: { type: ListType }) => {
  try {
    const result = await getListing({
      type,
      page: getRandomNumber(10),
      category: getRandomMovieCategory(),
    });

    if (!result.success) throw new Error(result.message);

    const movies = result.data?.results as Movie[];

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

export default LandingComponent;
