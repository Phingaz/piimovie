import React from 'react';
import LandingListingWrapper from './LadingListingWrapper';
import { ListType } from '@/app/types/utils';
import { fetchDiscover } from '@/app/queries/queries';
import { getQueryString, getRandomMovieCategory, getRandomNumber } from '@/lib/utils';
import { Movie } from '@/app/types/movies';
import ErrorPageComponent from '../helpers/Error';
import LandingComponentClient from '../general/LandingComponentClient';
import { Queries } from '@/lib/enums';

const LandingComponent = async ({ type }: { type: ListType }) => {
  try {
    const q = Queries(getRandomMovieCategory(), type);
    const params = getQueryString({ ...q, page: getRandomNumber(2).toString() });

    const result = await fetchDiscover({ type, params });
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
