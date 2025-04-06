import { Movie } from '@/app/types/movies';
import Link from 'next/link';
import React from 'react';
import { formatDate, imageCardUrl } from '@/lib/utils';
import ImageComponent from './ImageComponent';
import FavAndReview from './buttons/FavAndReview';
import { ListType } from '@/app/types/utils';
import { Show } from '@/app/types/show';

const ListingCard = ({ movie, genres, type }: { type: ListType; movie: Movie | Show; genres: string }) => {
  const title = type === 'movie' ? (movie as Movie).title : (movie as Show).name;
  const date = type === 'movie' ? (movie as Movie).release_date : (movie as Show).first_air_date;

  return (
    <div className="aspect-3/4 border border-gray-700/80 shadow-sm shadow-gray-700/80 rounded-md relative group overflow-clip transition-all">
      <FavAndReview type={type} movie={movie} title={title} />
      <Link key={movie.id} href={`/${type}/${movie.id}`} className="rounded-md h-full w-full ">
        <div className="from-50% bg-gradient-to-b to-black absolute z-1 top-0 left-0 w-full h-full flex items-end rounded-md">
          <div className="px-2 pb-1 text-gray-400 flex flex-col">
            <p className="text-base text-gray-200 leading-5">{title}</p>
            <p className="text-[12px]">{genres}</p>

            <div className="mt-2">{date && <p className="text-[12px]">{formatDate(date)}</p>}</div>
          </div>
        </div>
        <ImageComponent
          className="rounded-md group-hover:scale-110"
          string={imageCardUrl(movie.poster_path)}
          title={title}
        />
      </Link>
    </div>
  );
};

export default ListingCard;
