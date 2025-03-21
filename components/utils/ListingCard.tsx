import { Movie } from '@/app/types/movies';
import Link from 'next/link';
import React from 'react';
import { formatDate, imageCardUrl } from '@/lib/utils';
import ImageComponent from './ImageComponent';
import FavAndReview from './buttons/FavAndReview';

const ListingCard = ({ movie, genres }: { movie: Movie; genres: string }) => {
  return (
    <div className="aspect-3/4 border border-gray-700/80 shadow-sm shadow-gray-700/80 rounded-md relative group overflow-clip transition-all">
      <FavAndReview movie={movie} />
      <Link key={movie.id} href={`/movie/${movie.id}`} className="rounded-md h-full w-full ">
        <div className="from-60% bg-gradient-to-b to-black absolute z-1 top-0 left-0 w-full h-full flex items-end rounded-md">
          <div className="px-2 pb-1 text-gray-400 flex flex-col">
            <p className="text-base text-gray-200 leading-5">{movie.title}</p>
            <p className="text-[12px]">{genres}</p>

            <div className="mt-2">
              <p className="text-[12px]">{formatDate(movie.release_date)}</p>
            </div>
          </div>
        </div>
        <ImageComponent
          className="rounded-md group-hover:scale-110"
          string={movie.poster_path ? imageCardUrl(movie.poster_path) : '/placeholder.png'}
          title={movie.title}
        />
      </Link>
    </div>
  );
};

export default ListingCard;
