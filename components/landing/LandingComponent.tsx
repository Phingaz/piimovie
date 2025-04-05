import React from 'react';
import LandingListingWrapper from './LadingListingWrapper';
import { ListType } from '@/app/types/utils';
import { getListing } from '@/app/queries/queries';
import { getRandomMovieCategory, getRandomNumber } from '@/lib/utils';
import { Movie } from '@/app/types/movies';
import ErrorPageComponent from '../helpers/Error';
import LandingComponentClient from '../ui/LandingComponentClient';

const LandingComponent = async ({ type }: { type: ListType }) => {
  try {
    const result = await getListing({
      type,
      fetchCategory: true,
      category: getRandomMovieCategory(),
      page: getRandomNumber(10).toString(),
    });

    if (!result.success) throw new Error(result.message);

    const movies = result.data?.results as Movie[];

    return (
      <section>
        <LandingComponentClient type={type} items={movies} />
        <LandingListingWrapper type={type} />
      </section>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
};

export default LandingComponent;
