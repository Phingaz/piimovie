'use client';
import { Movie } from '@/app/types/movies';
import Link from 'next/link';
import React from 'react';
import { imageCardUrl } from '@/lib/utils';
import ImageComponent from '../utils/ImageComponent';
import CarouselItem from '../carousel/CarouselItem';
import FavAndReview from '../utils/buttons/FavAndReview';

const LandingCard = ({ movie }: { movie: Movie }) => {
  return (
    <CarouselItem className="carousel-item relative">
      <FavAndReview movie={movie} />
      <Link href={`/movie/${movie.id}`} className="w-full max-w-[100px] h-full relative">
        <ImageComponent
          className="group-hover:scale-110"
          string={movie.poster_path ? imageCardUrl(movie.poster_path) : '/placeholder.png'}
          title={movie.title}
        />
      </Link>
    </CarouselItem>
  );
};

export default LandingCard;
