import React from 'react';
import CarouselWrapper from '../carousel/CarouselWrapper';
import SectionTitle from '../utils/texts/SectionTitle';
import { ErrorMovieSection } from '../helpers/Error';
import LandingCard from '../landing/LandingMovieCard';
import EmptyList from '../utils/EmptyList';
import { getSimilar } from '@/app/queries/queries';
import { ListType } from '@/app/types/utils';

const Similar = async ({ id, type }: { id: number; type: ListType }) => {
  try {
    const response = await getSimilar({ id, type });
    if (!response.data) throw new Error(response.message);
    const similarMovies = response.data.results;

    return (
      <div>
        <SectionTitle>
          <>Similar {type === 'movie' ? 'Movies' : 'Tv Shows'}</>
        </SectionTitle>

        {similarMovies.length < 1 ? (
          <EmptyList type="similar movies found" message="We couldn't find any similar movies at the moment." />
        ) : (
          <CarouselWrapper isLanding={false} hideButtons={similarMovies.length < 1}>
            {similarMovies.map((movie) => {
              return <LandingCard key={movie.id} movie={movie} type={type} />;
            })}
          </CarouselWrapper>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorMovieSection error={error} title={`Similar ${type === 'movie' ? 'Movies' : 'Tv Shows'}`} />;
  }
};

export default Similar;
