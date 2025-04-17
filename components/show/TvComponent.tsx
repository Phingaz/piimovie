import React from 'react';
import { ListType } from '@/app/_types/utils';
import { fetchDiscover } from '@/app/_queries/queries';
import { getQueryString, getRandomNumber, getRandomShowCategory } from '@/lib/utils';
import { Show } from '@/app/_types/show';
import ErrorPageComponent from '../helpers/Error';
import LandingComponentClient from '../general/LandingComponentClient';
import LandingListingWrapper from '../landing/LadingListingWrapper';
import { Queries } from '@/lib/enums';

const TvComponent = async ({ type }: { type: ListType }) => {
  try {
    const q = Queries(getRandomShowCategory(), type);
    const params = getQueryString({ ...q, page: getRandomNumber(2).toString() });

    const result = await fetchDiscover({ type, params });
    if (!result.success) throw new Error(result.message);

    const movies = result.data?.results as Show[];

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

export default TvComponent;
