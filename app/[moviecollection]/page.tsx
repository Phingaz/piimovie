"use client";
import React from "react";
import Queries from "../_context/Queries";
import { moveiGenreId, movieList } from "../constants";
import { useSearchParams } from "next/navigation";
import CollectionCard from "../_components/cards/CollectionCard";
import Pagination from "../_components/utils/Pagination";

const MovieCollection = () => {
  const { getLandingMovies } = React.useContext(Queries);
  const { data } = getLandingMovies;
  const movies = data?.results;

  const list = useSearchParams().get("list");
  const page = useSearchParams().get("page");

  const title = movieList.find((movie) => movie.id === list)?.name;
  const totalPage = data?.total_pages;

  return (
    <div className="bg-bg min-h-[100svh] text-white">
      <div className="container mx-auto py-10 md:py-20 px-3 md:px-[2rem]">
        <h1 className="mb-8 text-4xl font-bold">{title}</h1>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3
         mb-10"
        >
          {movies?.map((movie) => {
            const genres = moveiGenreId
              .filter((genre) => movie.genre_ids.includes(genre.id))
              .map((genre) => genre.name)
              .join(", ");

            return (
              <CollectionCard key={movie.id} movie={movie} genres={genres} />
            );
          })}
        </div>
        <Pagination page={page} totalPage={totalPage} list={list} />
      </div>
    </div>
  );
};

export default MovieCollection;
