import { Movie } from "@/app/types";
import Link from "next/link";
import React from "react";
import ImageComponent from "../utils/ImageComponent";
import { isFav } from "@/lib/utils";
import Favorite from "../utils/Favorite";

const LandingCard = ({
  movie,
  favMovies,
  manageFav,
}: {
  movie: Movie;
  favMovies: Movie[];
  manageFav: (movie: Movie) => void;
}) => {
  const isFavorite = isFav(favMovies, movie);

  return (
    <div className={`carousel-item relative`}>
      <div className="absolute top-0 right-0 p-2 cursor-pointer z-50">
        <Favorite
          isFavourite={isFavorite}
          manageFav={manageFav}
          movieDetail={movie}
        />
      </div>
      <Link href={`/movie/${movie.id}`} className="w-full h-full relative">
        <ImageComponent
          string={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          title={movie.title}
        />
      </Link>
    </div>
  );
};

export default LandingCard;
