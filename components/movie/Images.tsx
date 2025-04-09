import React from 'react';
import CarouselWrapper from '../carousel/CarouselWrapper';
import CarouselItem from '../carousel/CarouselItem';
import SectionTitle from '../utils/texts/SectionTitle';
import { ErrorMovieSection } from '../helpers/Error';
import ImageModalCard from '../modals/ImageModalCard';
import { getImages } from '@/app/queries/queries';
import { ListType } from '@/app/types/utils';

const Images = async ({ id, type }: { id: number; type: ListType }) => {
  try {
    const response = await getImages({ id, type });
    if (!response.data) throw new Error(response.message);
    const images = response.data.backdrops;

    if (images.length < 1) return null;

    return (
      <div className="w-full">
        <SectionTitle>
          <>Images</>
        </SectionTitle>
        <CarouselWrapper isLanding={false}>
          {images.map((el) => {
            return (
              <CarouselItem
                key={el.file_path}
                className={`rounded-md carousel-item ${images.length > 1 ? 'multiple' : 'single'}`}
              >
                <ImageModalCard el={el} />
              </CarouselItem>
            );
          })}
        </CarouselWrapper>
      </div>
    );
  } catch (error) {
    return <ErrorMovieSection error={error} title="Images" />;
  }
};

export default Images;
