"use client";
import Genres from "@/app/_components/sections/movieDetails/Genres";
import Images from "@/app/_components/sections/movieDetails/Images";
import Infos from "@/app/_components/sections/movieDetails/Infos";
import RecommendedMovies from "@/app/_components/sections/movieDetails/Recomended";
import SimilarMovies from "@/app/_components/sections/movieDetails/Similar";
import { PageLoader } from "@/app/_components/utils/Loader";
import MovieDetailInfo from "@/app/_components/utils/MovieDetailInfo";
import { Video } from "@/app/_components/utils/Video";
import Queries from "@/app/_context/Queries";
import { MovieDetail as TMD } from "@/app/types";
import { formatCurrency, runTimeInHourAndMin } from "@/lib/utils";
import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const MovieDetail = () => {
  const { movie } = React.useContext(Queries);

  const { data, isLoading } = movie;
  const movieDetail = data as TMD;

  if (isLoading) return <PageLoader />;

  const percentage = Math.round(movieDetail.vote_average * 100 * 0.1);

  return (
    <div className="bg-bg min-h-[100svh]">
      <div className="container py-10 md:py-20 text-white">
        <Video />
        <div className="mt-7">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-5xl font-bold  text-gray-200">
              {movieDetail?.title}
            </h2>
            <div className="size-14">
              <CircularProgressbar
                strokeWidth={15}
                value={percentage}
                text={`${percentage}%`}
                className="font-[500]"
              />
            </div>
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
            <div className="flex-1 flex flex-col gap-3">
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
