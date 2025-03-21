import { MovieCategory, MovieCategoryEnum } from '@/app/types/movies';
import Link from 'next/link';
import React from 'react';
import { ErrorSectionComponent } from '../helpers/Error';
import CarouselWrapper from '../carousel/CarouselWrapper';
import LandingCard from './LandingMovieCard';
import { ShowCategory, ShowCategoryEnum } from '@/app/types/show';
import { getListing } from '@/app/queries/queries';
import { ListType } from '@/app/types/utils';

const LandingListing = async ({ type, category }: { type: ListType; category: MovieCategory | ShowCategory }) => {
  const title =
    type === 'movie' ? MovieCategoryEnum[category as MovieCategory] : ShowCategoryEnum[category as ShowCategory];

  try {
    const response = await getListing({ category, page: 1, type });

    const items = response.data?.results;

    if (!items || !response.success) {
      throw new Error(`Something went wrong fetching this list: ${response.message}`);
    }

    return (
      <div className="w-full mb-15">
        <div className="flex justify-between items-center mb-[17px]">
          <h2 className="text-xl md:text-2xl font-[600] text-gray-300">{title}</h2>

          <Link
            className="text-sm font-[600] transition hover:text-blue-500 hover:scale-105"
            href={`/listing?category=${category}&page=1`}
          >
            See more
          </Link>
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
