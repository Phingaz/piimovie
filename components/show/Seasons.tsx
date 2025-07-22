'use client';
import React from 'react';
import CarouselWrapper from '../carousel/CarouselWrapper';
import CarouselItem from '../carousel/CarouselItem';
import SectionTitle from '../utils/texts/SectionTitle';
import EmptyList from '../utils/EmptyList';
import { Season } from '@/app/_types/utils';
import SeasonModal from '../modals/SeasonModal';

const Seasons = ({ seasons, tvId, showName }: { seasons: Season[]; tvId: number; showName: string }) => {
  return (
    <div>
      <SectionTitle>
        <>Seasons</>
      </SectionTitle>

      {seasons.length < 1 ? (
        <EmptyList message="We couldn't find the seasons information for this show." />
      ) : (
        <CarouselWrapper isLanding={false}>
          {seasons.map((el) => {
            return (
              <CarouselItem key={el.id} className="rounded-md carousel-item relative">
                <SeasonModal season={el} tvId={tvId} showName={showName} />
              </CarouselItem>
            );
          })}
        </CarouselWrapper>
      )}
    </div>
  );
};

export default Seasons;
