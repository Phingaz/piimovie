import { Movie } from "@/app/types";
import Link from "next/link";
import React from "react";
import ImageComponent from "../utils/ImageComponent";
import { isFav } from "@/lib/utils";
import Favorite from "../utils/Favorite";
import Main from "@/app/_context/Main";

const LandingCard = ({ movie }: { movie: Movie }) => {
  const { favMovies, manageFav } = React.useContext(Main);
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
      <Link href={`/movie/${movie.id}`} className="w-full max-w-[100px] h-full relative">
        <ImageComponent
          string={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
              : "/placeholder.png"
          }
          title={movie.title}
        />
      </Link>
    </div>
  );
};

export default LandingCard;
