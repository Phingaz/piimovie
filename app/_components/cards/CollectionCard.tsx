import { Movie } from "@/app/types";
import { cleanDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ImageComponent from "../utils/ImageComponent";

const CollectionCard = ({
  movie,
  genres,
}: {
  movie: Movie;
  genres: string;
}) => {
  return (
    <Link
      href={`/movie/${movie.id}`}
      key={movie.id}
      className="w-full h-full cursor-pointer rounded-lg relative overflow-clip hover:shadow-xl transition-all ease-in-out duration-200 hover:rounded-lg hover:scale-105"
    >
      <div className="w-full h-full relative overflow-clip rounded-lg aspect-[3/4]">
        <ImageComponent
          string={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
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
  );
};

export default CollectionCard;
