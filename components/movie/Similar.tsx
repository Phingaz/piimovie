import React from 'react';
import CarouselWrapper from '../carousel/CarouselWrapper';
import SectionTitle from '../utils/texts/SectionTitle';
import { ErrorMovieSection } from '../helpers/Error';
import LandingCard from '../landing/LandingMovieCard';
import EmptyList from '../utils/EmptyList';
import { getSimilarMovie } from '@/app/queries/movies';

const Similar = async ({ id }: { id: number }) => {
  try {
    const response = await getSimilarMovie({ id });
    if (!response.data) throw new Error(response.message);
    const similarMovies = response.data.results;

    return (
      <div>
        <SectionTitle>
          <>Similar Movies</>
        </SectionTitle>

        {similarMovies.length < 1 ? (
          <EmptyList type="similar movies found" message="We couldn't find any similar movies at the moment." />
        ) : (
          <CarouselWrapper isLanding={false} hideButtons={similarMovies.length < 1}>
            {similarMovies.map((movie) => {
              return <LandingCard key={movie.id} movie={movie} />;
            })}
          </CarouselWrapper>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorMovieSection error={error} title="Similar Movies" />;
  }
};

export default Similar;
