import { Movie } from "@/app/types";
import { cleanDate, isFav } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import ImageComponent from "../utils/ImageComponent";
import Favorite from "../utils/Favorite";
import Main from "@/app/_context/Main";

const CollectionCard = ({
  movie,
  genres,
  showMore,
}: {
  movie: Movie;
  genres: string;
  showMore?: boolean;
}) => {
  const { favMovies, manageFav } = React.useContext(Main);
  const isFavorite = isFav(favMovies, movie);
  return (
    <div
      key={movie.id}
      className="w-full h-full cursor-pointer rounded-lg relative overflow-clip transition-all ease-in-out duration-150"
    >
      <div className="absolute top-0 right-0 p-2 cursor-pointer z-50">
        <Favorite
          isFavourite={isFavorite}
          manageFav={manageFav}
          movieDetail={movie}
        />
      </div>
      <Link href={`/movie/${movie.id}`}>
        <div className="w-full h-full relative overflow-clip rounded-lg aspect-[3/5]">
          <ImageComponent
            string={
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                : "/placeholder.png"
            }
            title={movie.title}
          />
        </div>
        <div className="p-3 absolute bottom-0 left-0 w-full bg-black/80 rounded-lg rounded-tr-none rounded-tl-none text-gray-300">
          <h3 className="text-sm sm:text-base md:text-lg font-bold leading-tight mb-3 text-gray-200">
            {movie.title}
          </h3>

          {showMore && (
            <>
              <p className="font-[500] text-[10px] md:text-xs mb-1">{genres}</p>
              <p className="font-[500] text-[10px] md:text-xs ">
                Release Date: {cleanDate(movie.release_date)}
              </p>
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CollectionCard;
