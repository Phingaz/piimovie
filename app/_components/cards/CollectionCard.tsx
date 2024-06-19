import { Movie } from "@/app/types";
import { cleanDate, isFav } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import ImageComponent from "../utils/ImageComponent";
import Favorite from "../utils/Favorite";

const CollectionCard = ({
  movie,
  genres,
  manageFav,
  favMovies,
}: {
  movie: Movie;
  genres: string;
  manageFav: (movie: Movie) => void;
  favMovies: Movie[];
}) => {
  const isFavorite = isFav(favMovies, movie);
  return (
    <div
      key={movie.id}
      className="w-full h-full cursor-pointer rounded-lg relative overflow-clip hover:shadow-xl transition-all ease-in-out duration-150 hover:rounded-lg hover:scale-105"
    >
      <div className="absolute top-0 right-0 p-2 cursor-pointer z-50">
        <Favorite
          isFavourite={isFavorite}
          manageFav={manageFav}
          movieDetail={movie}
        />
      </div>
      <Link href={`/movie/${movie.id}`}>
        <div className="w-full h-full relative overflow-clip rounded-lg aspect-[3/4]">
          <ImageComponent
            string={
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`
                : "/placeholder.png"
            }
            title={movie.title}
          />
        </div>
        <div className="p-3 absolute bottom-0 left-0 w-full bg-black/80 rounded-lg rounded-tr-none rounded-tl-none">
          <h3 className="text-white md:text-lg font-bold leading-tight mb-3">
            {movie.title}
          </h3>

          <p className="font-[500] text-[10px] md:text-xs mb-1">{genres}</p>
          <p className="font-[500] text-[10px] md:text-xs ">
            Release Date: {cleanDate(movie.release_date)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CollectionCard;
