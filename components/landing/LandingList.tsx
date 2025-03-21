import { MovieType, MovieTypeEnum } from '@/app/types';
import Link from 'next/link';
import React from 'react';
import { ErrorSectionComponent } from '../helpers/Error';
import CarouselWrapper from '../carousel/CarouselWrapper';
import LandingCard from './LandingMovieCard';
import { getMovies } from '@/app/queries/queries';

const LandingListing = async ({ type }: { type: MovieType }) => {
  try {
    const response = await getMovies({ page: 1, type });
    const title = MovieTypeEnum[type];
    const movies = response.data?.results;

    if (!movies || !response.success)
      throw new Error(`Something went wrong fetching this movie list ${response.message}`);

    return (
      <div className="w-full mb-15">
        <div className="flex justify-between items-center mb-[17px]">
          <h2 className="text-xl md:text-2xl font-[600] text-gray-300">{title}</h2>

          <Link
            className="text-sm font-[600] transition hover:text-blue-500 hover:scale-105"
            href={`/movies?list=${type}&page=1`}
          >
            See more
          </Link>
        </div>
        <CarouselWrapper isLanding>
          {movies.map((movie) => (
            <LandingCard key={movie.id} movie={movie} />
          ))}
        </CarouselWrapper>
      </div>
    );
  } catch (error) {
    return <ErrorSectionComponent type={type} error={error} />;
  }
};

export default LandingListing;
