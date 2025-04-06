import React from 'react';
import CarouselWrapper from '../carousel/CarouselWrapper';
import SectionTitle from '../utils/texts/SectionTitle';
import { ErrorMovieSection } from '../helpers/Error';
import LandingCard from '../landing/LandingMovieCard';
import EmptyList from '../utils/EmptyList';
import { getRecomendation } from '@/app/queries/queries';
import { ListType } from '@/app/types/utils';

const Recommended = async ({ id, type }: { id: number; type: ListType }) => {
  try {
    const response = await getRecomendation({ id, type });

    if (!response.data) throw new Error(response.message);
    const recommendedmovies = response.data.results;

    return (
      <div>
        <SectionTitle>
          <>Recommended {type === 'movie' ? 'Movies' : 'Tv Shows'}</>
        </SectionTitle>
        {recommendedmovies.length < 1 ? (
          <EmptyList type="recommended movies found" message="We couldn't find any recommended movies at the moment." />
        ) : (
          <CarouselWrapper isLanding={false}>
            {recommendedmovies.map((movie) => {
              return <LandingCard type={type} key={movie.id} movie={movie} />;
            })}
          </CarouselWrapper>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorMovieSection error={error} title={`Similar ${type === 'movie' ? 'Movies' : 'Tv Shows'}`} />;
  }
};

export default Recommended;
