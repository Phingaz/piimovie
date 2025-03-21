import React from 'react';
import CarouselWrapper from '../carousel/CarouselWrapper';
import CarouselItem from '../carousel/CarouselItem';
import { imageCardUrl } from '@/lib/utils';
import ImageComponent from '../utils/ImageComponent';
import SectionTitle from '../utils/texts/SectionTitle';
import { ErrorMovieSection } from '../helpers/Error';
import EmptyList from '../utils/EmptyList';
import Link from 'next/link';
import { getMovieCredits } from '@/app/queries/queries';

const Credits = async ({ id }: { id: number }) => {
  try {
    const response = await getMovieCredits({ id });
    if (!response.data) throw new Error(response.message);
    const credits = response.data.cast;

    return (
      <div>
        <SectionTitle>
          <>Cast & Crew</>
        </SectionTitle>

        {credits.length < 1 ? (
          <EmptyList message="We couldn't find the cast & crew information for this movie." />
        ) : (
          <CarouselWrapper isLanding={false}>
            {credits.map((el) => {
              return (
                <CarouselItem key={el.id} className="rounded-md carousel-item">
                  <div className="from-65% bg-gradient-to-b to-black absolute top-0 left-0 w-full h-full flex items-end z-[1000]">
                    <span className="px-2 pb-1 cursor-text drop-shadow-sm flex flex-col gap">
                      <Link
                        target="_blank"
                        href={`https://www.google.com/search?q=${el.name}`}
                        className="text-gray-50 text-[15px] underline underline-offset-2"
                      >
                        {el.name}
                      </Link>
                      <Link
                        target="_blank"
                        href={`https://www.google.com/search?q=${el.character}`}
                        className="text-[13px] text-gray-300"
                      >
                        {el.character}
                      </Link>
                    </span>
                  </div>
                  <ImageComponent
                    string={el.profile_path ? imageCardUrl(el.profile_path) : '/placeholder.png'}
                    title={el.name}
                  />
                </CarouselItem>
              );
            })}
          </CarouselWrapper>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorMovieSection error={error} title="Cast & Crew" />;
  }
};

export default Credits;
