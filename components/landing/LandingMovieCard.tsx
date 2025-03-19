"use client";
import { Movie } from "@/app/types";
import Link from "next/link";
import React from "react";
import { imageCardUrl } from "@/lib/utils";
import Favorite from "../utils/buttons/Favorite";
import ImageComponent from "../utils/ImageComponent";
import CarouselItem from "../carousel/CarouselItem";
import Ratings from "../utils/texts/Ratings";

const LandingCard = ({ movie }: { movie: Movie }) => {
  return (
    <CarouselItem className="carousel-item relative">
      <div className="absolute top-0 right-0 p-2 cursor-pointer z-50 w-full flex justify-between">
        <Ratings showBg isReview vote_average={movie.vote_average} />
        <Favorite movie={movie} />
      </div>
      <Link
        href={`/movie/${movie.id}`}
        className="w-full max-w-[100px] h-full relative"
      >
        <ImageComponent
          string={
            movie.poster_path
              ? imageCardUrl(movie.poster_path)
              : "/placeholder.png"
          }
          title={movie.title}
        />
      </Link>
    </CarouselItem>
  );
};

export default LandingCard;
