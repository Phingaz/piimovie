import { Movie } from "@/app/types";
import Link from "next/link";
import React from "react";
import ImageComponent from "../utils/ImageComponent";

const LandingCard = ({ movie }: { movie: Movie }) => {
  return (
    <Link href={`/movie/${movie.id}`} className={`carousel-item`}>
      <div className="w-full h-full relative">
        <ImageComponent
          string={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          title={movie.title}
        />
      </div>
    </Link>
  );
};

export default LandingCard;
