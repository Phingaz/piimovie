import React from 'react';
import CarouselWrapper from '../carousel/CarouselWrapper';
import SectionTitle from '../utils/texts/SectionTitle';
import { ErrorMovieSection } from '../helpers/Error';
import LandingCard from '../landing/LandingMovieCard';
import EmptyList from '../utils/EmptyList';
import { getRecomendedMovie } from '@/app/queries/movies';

const Recommended = async ({ id }: { id: number }) => {
  try {
    const response = await getRecomendedMovie({ id });
    if (!response.data) throw new Error(response.message);
    const recommendedmovies = response.data.results;

    return (
      <div>
        <SectionTitle>
          <>Recommended Movies</>
        </SectionTitle>
        {recommendedmovies.length < 1 ? (
          <EmptyList type="recommended movies found" message="We couldn't find any recommended movies at the moment." />
        ) : (
          <CarouselWrapper isLanding={false}>
            {recommendedmovies.map((movie) => {
              return <LandingCard key={movie.id} movie={movie} />;
            })}
          </CarouselWrapper>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorMovieSection error={error} title="Recommended Movies" />;
  }
};

export default Recommended;
