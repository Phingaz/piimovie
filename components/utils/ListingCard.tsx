import { Movie } from "@/app/types";
import Link from "next/link";
import React from "react";
import Ratings from "./texts/Ratings";
import Favorite from "./buttons/Favorite";
import { formatDate, imageCardUrl } from "@/lib/utils";
import ImageComponent from "./ImageComponent";

const ListingCard = ({ movie, genres }: { movie: Movie; genres: string }) => {
  return (
    <Link
      key={movie.id}
      href={`/movie/${movie.id}`}
      className="relative rounded-md aspect-3/4 border border-gray-700/80 shadow-sm shadow-gray-700/80"
    >
      <div className="bg-gradient-to-b to-black absolute top-0 left-0 w-full h-full flex items-end rounded-md">
        <div className="absolute top-0 right-0 p-2 cursor-pointer z-50 w-full flex justify-between">
          <Ratings showBg isReview vote_average={movie.vote_average} />
          <Favorite movie={movie} />
        </div>
        <div className="px-2 pb-1 text-gray-400 flex flex-col">
          <p className="text-base text-gray-200 leading-5">{movie.title}</p>
          <p className="text-[12px]">{genres}</p>

          <div className="mt-2">
            <p className="text-[12px]">{formatDate(movie.release_date)}</p>
          </div>
        </div>
      </div>
      <ImageComponent
        className="rounded-md"
        string={
          movie.poster_path
            ? imageCardUrl(movie.poster_path)
            : "/placeholder.png"
        }
        title={movie.title}
      />
    </Link>
  );
};

export default ListingCard;
