import { Movie } from '@/app/_types/movies';
import Link from 'next/link';
import React from 'react';
import { imageCardUrl } from '@/lib/utils';
import ImageComponent from '../utils/ImageComponent';
import CarouselItem from '../carousel/CarouselItem';
import FavAndReview from '../utils/buttons/FavAndReview';
import { Show } from '@/app/_types/show';
import { ListType } from '@/app/_types/utils';

const LandingCard = ({ type, movie }: { type: ListType; movie: Movie | Show }) => {
  const title = movie ? (movie as Movie).title || (movie as Show).original_name : '';

  return (
    <CarouselItem className="carousel-item relative">
      <FavAndReview type={type} title={title} movie={movie} />
      <Link href={`/${type}/${movie.id}`} className="w-full max-w-[100px] h-full relative">
        <ImageComponent title={title} string={imageCardUrl(movie?.poster_path, 'w342')} />
      </Link>
    </CarouselItem>
  );
};

export default LandingCard;
