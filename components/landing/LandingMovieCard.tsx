import { Movie } from '@/app/types/movies';
import Link from 'next/link';
import React from 'react';
import { imageCardUrl } from '@/lib/utils';
import ImageComponent from '../utils/ImageComponent';
import CarouselItem from '../carousel/CarouselItem';
import FavAndReview from '../utils/buttons/FavAndReview';
import { Show } from '@/app/types/show';
import { ListType } from '@/app/types/utils';

const LandingCard = ({ type, movie }: { type: ListType; movie: Movie | Show }) => {
  const title = movie ? (movie as Movie).title || (movie as Show).original_name : '';

  return (
    <CarouselItem className="carousel-item relative">
      <FavAndReview title={title} movie={movie} />
      <Link href={`/${type}/${movie.id}`} className="w-full max-w-[100px] h-full relative">
        <ImageComponent title={title} className="group-hover:scale-110" string={imageCardUrl(movie?.poster_path)} />
      </Link>
    </CarouselItem>
  );
};

export default LandingCard;
