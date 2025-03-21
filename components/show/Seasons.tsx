import React from 'react';
import CarouselWrapper from '../carousel/CarouselWrapper';
import CarouselItem from '../carousel/CarouselItem';
import { imageCardUrl } from '@/lib/utils';
import ImageComponent from '../utils/ImageComponent';
import SectionTitle from '../utils/texts/SectionTitle';
import { ErrorMovieSection } from '../helpers/Error';
import EmptyList from '../utils/EmptyList';
import NumberOfSeasons from './NumberOfSeasons';
import NumberOfEpisodes from './NumberOfEpisodes';
import Ratings from '../utils/texts/Ratings';
import ReleaseDate from '../utils/texts/ReleaseDate';
import { Season } from '@/app/types/utils';

const Seasons = async ({ seasons }: { seasons: Season[] }) => {
  try {
    return (
      <div>
        <SectionTitle>
          <>Seasons</>
        </SectionTitle>

        {seasons.length < 1 ? (
          <EmptyList message="We couldn't find the cast & crew information for this movie." />
        ) : (
          <CarouselWrapper isLanding={false}>
            {seasons.map((el) => {
              return (
                <CarouselItem key={el.id} className="rounded-md carousel-item relative">
                  <div className="from-65% bg-gradient-to-b to-black absolute top-0 left-0 w-full h-full flex items-end z-1">
                    <div className="p-1 flex flex-wrap justify-evenly">
                      <NumberOfSeasons custom={el.name} isCard number_of_seasons={el.season_number} />
                      <NumberOfEpisodes isCard number_of_episodes={el.episode_count} />
                      <Ratings vote_average={el.vote_average} isReview />
                      <ReleaseDate isCard release_date={el.air_date} />
                    </div>
                  </div>
                  <ImageComponent string={imageCardUrl(el.poster_path)} title={el.name} />
                </CarouselItem>
              );
            })}
          </CarouselWrapper>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorMovieSection error={error} title="Seasons" />;
  }
};

export default Seasons;
