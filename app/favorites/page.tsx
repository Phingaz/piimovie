"use client";
import React from "react";
import Main from "../_context/Main";
import LandingCard from "../_components/cards/LandingCard";

const Favorties = () => {
  const { favMovies, manageFav } = React.useContext(Main);
  return (
    <div className="bg-bg min-h-[100svh] text-white pt-10">
      <div className="container mx-auto py-10 md:pt-20 px-3 md:px-[2rem]">
        <h1 className="mb-8 text-4xl font-bold">Favorites</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3">
          {favMovies?.map((movie) => {
            return <LandingCard key={movie.id} movie={movie} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Favorties;
