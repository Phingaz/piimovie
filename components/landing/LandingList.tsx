import { MovieCategory } from '@/app/types/movies';
import React from 'react';
import { ErrorSectionComponent } from '../helpers/Error';
import CarouselWrapper from '../carousel/CarouselWrapper';
import LandingCard from './LandingMovieCard';
import { ShowCategory } from '@/app/types/show';
import { fetchDiscover } from '@/app/queries/queries';
import { ListType } from '@/app/types/utils';
import SeeMore from './SeeMore';
import { MovieCategoryEnum, Queries, ShowCategoryEnum } from '@/lib/enums';
import { getQueryString } from '@/lib/utils';

const LandingListing = async ({ type, category }: { type: ListType; category: MovieCategory | ShowCategory }) => {
  const title =
    type === 'movie' ? MovieCategoryEnum[category as MovieCategory] : ShowCategoryEnum[category as ShowCategory];

  try {
    const q = Queries(category, type)[category];
    const params = getQueryString(q);
    const response = await fetchDiscover({ type, params });
    const items = response.data?.results;

    if (!items || !response.success) {
      throw new Error(`Something went wrong fetching this list: ${response.message}`);
    }

    return (
      <div className="w-full mb-15">
        <div className="flex justify-between items-center mb-[17px]">
          <h2 className="text-xl md:text-2xl font-[600] text-gray-300">{title}</h2>
          <SeeMore category={category} type={type} />
        </div>
        <CarouselWrapper isLanding>
          {items.map((item) => (
            <LandingCard key={item.id} movie={item} type={type} />
          ))}
        </CarouselWrapper>
      </div>
    );
  } catch (error) {
    return <ErrorSectionComponent title={title} error={error} />;
  }
};

export default LandingListing;
