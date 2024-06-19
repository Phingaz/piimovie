"use client";
import CollectionCard from "@/app/_components/cards/CollectionCard";
import Pagination from "@/app/_components/utils/Pagination";
import Search from "@/app/_components/utils/Search";
import Main from "@/app/_context/Main";
import Queries from "@/app/_context/Queries";
import { moveiGenreId, movieList } from "@/app/constants";
import React from "react";
import useCustomParams from "../_hooks/useCustomParams";

const MovieCollection = () => {
  const { list } = useCustomParams();

  const { collection } = React.useContext(Queries);
  const { manageFav, favMovies } = React.useContext(Main);

  const { data } = collection;

  const movies = data?.results;

  const title = movieList.find((movie) => movie.id === list)?.name;
  const totalPage = data?.total_pages;

  return (
    <div className="bg-bg min-h-[100svh] text-white pt-10">
      <div className="container mx-auto py-10 md:py-20 px-3 md:px-[2rem]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{title}</h1>
          <Search />
        </div>
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
              <CollectionCard
                key={movie.id}
                movie={movie}
                genres={genres}
                manageFav={manageFav}
                favMovies={favMovies}
              />
            );
          })}
        </div>
        <Pagination totalPage={totalPage} />
      </div>
    </div>
  );
};

export default MovieCollection;
