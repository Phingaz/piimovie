"use client";
import Genres from "@/app/_components/sections/movieDetails/Genres";
import Images from "@/app/_components/sections/movieDetails/Images";
import Infos from "@/app/_components/sections/movieDetails/Infos";
import RecommendedMovies from "@/app/_components/sections/movieDetails/Recomended";
import SimilarMovies from "@/app/_components/sections/movieDetails/Similar";
import { InvalidMovieId } from "@/app/_components/utils/Error";
import Favorite from "@/app/_components/utils/Favorite";
import { PageLoader } from "@/app/_components/utils/Loader";
import { Video } from "@/app/_components/utils/Video";
import Main from "@/app/_context/Main";
import Queries from "@/app/_context/Queries";
import { Movie, MovieDetail as TMD } from "@/app/types";
import { isFav } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const MovieDetail = () => {
  const { movie } = React.useContext(Queries);
  const { manageFav, favMovies } = React.useContext(Main);

  const { data, isLoading } = movie;
  const movieDetail = data as TMD;

  if (isLoading) return <PageLoader />;
  if (!movieDetail) return <InvalidMovieId />;

  const isFavourite = isFav(favMovies, movieDetail as unknown as Movie);

  return (
    <div className="bg-bg min-h-[100svh] pt-10">
      <div className="container py-10 md:py-20 text-white">
        <Video />
        <div className="mt-7">
          <div className="flex mb-8 gap-3 items-center flex-wrap">
            <Link
              href={`/download?search=${movieDetail?.title}`}
              className="text-3xl md:text-5xl font-bold text-gray-200"
            >
              {movieDetail?.title}
            </Link>
            <Favorite
              manageFav={manageFav}
              isFavourite={isFavourite}
              movieDetail={movieDetail as unknown as Movie}
            />
          </div>
          <div className="flex justify-between flex-col md:flex-row gap-8">
            <div className="flex-[2] flex flex-col gap-5">
              <p className="text-sm font-[500] text-gray-300">
                {movieDetail?.overview}
              </p>
              <Genres genres={movieDetail?.genres} />
              <SimilarMovies />
              <RecommendedMovies />
            </div>
            <div className="flex-1 flex flex-col gap-3 md:w-[40%]">
              <Infos movieDetail={movieDetail} />
              <Images />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
