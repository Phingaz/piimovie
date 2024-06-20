"use client";
import React from "react";
import Queries from "../_context/Queries";
import Main from "../_context/Main";
import Pagination from "../_components/utils/Pagination";
import CollectionCard from "../_components/cards/CollectionCard";
import { movieGenreId } from "../constants";
import Search from "../_components/utils/Search";
import useCustomParams from "../_hooks/useCustomParams";

const SearchComponent = () => {
  const { searchMovies } = React.useContext(Queries);
  const { manageFav, favMovies } = React.useContext(Main);
  const { data } = searchMovies;
  const movies = data?.results;

  const { search } = useCustomParams();

  const totalPage = data?.total_pages;

  return (
    <div className="bg-bg min-h-[100svh] text-white pt-10">
      <div className="container mx-auto py-10 md:py-20 px-3 md:px-[2rem]">
        <div className="flex md:justify-between md:items-center mb-8 md:flex-row flex-col gap-3 md:gap-0">
          <h1 className="text-4xl font-bold">Search</h1>
          <Search />
        </div>
        <div>
          {search === null ? (
            <div>
              <p className="text-2xl">Search for a movie</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-10">
                {movies?.map((movie) => {
                  const genres = movieGenreId
                    .filter((genre) => movie.genre_ids.includes(genre.id))
                    .map((genre) => genre.name)
                    .join(", ");

                  return (
                    <CollectionCard
                      key={movie.id}
                      movie={movie}
                      genres={genres}
                    />
                  );
                })}
              </div>
              <Pagination totalPage={totalPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
