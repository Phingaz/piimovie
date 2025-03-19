"use client";
import React, { createContext } from "react";
import useLocalStorage from "../_hooks/useLocalStorage";
import { Movie } from "../types";

export type TFavoriteCtx = {
  favMovies: Movie[];
  manageFav: (id: Movie) => void;
};

const FavoriteCtx = createContext<TFavoriteCtx | undefined>(undefined);

export function FavoriteCtxProvider({ children }: React.PropsWithChildren) {
  const [favMovies, setFavMovies] = useLocalStorage(
    "@favMovies",
    [] as Movie[]
  );

  const manageFav = (movie: Movie) => {
    const isFav = favMovies.find((favMovie) => favMovie.id === movie.id);

    if (isFav) {
      setFavMovies((prevFavMovies) =>
        prevFavMovies.filter((favMovie) => favMovie.id !== movie.id)
      );
    } else {
      setFavMovies((prevFavMovies) => [...prevFavMovies, movie]);
    }
  };

  const contextValue = {
    favMovies,
    manageFav,
  };

  return (
    <FavoriteCtx.Provider value={contextValue}>{children}</FavoriteCtx.Provider>
  );
}

export const useFavoriteCtx = () => {
  const context = React.useContext(FavoriteCtx);
  if (!context)
    throw new Error("useFavoriteCtx must be used within a FavoriteCtxProvider");
  return context;
};

export default FavoriteCtx;
