"use client"
import { getRandomMovie, imageUrl, preloadImage } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Movie } from "../types";

const time = 2000;
const intervalTime = 50000;

const useHero = (movies: Movie[]) => {
  const [movie, setMovie] = useState<Movie | null>(() =>
    getRandomMovie(movies)
  );
  const [nextMovie, setNextMovie] = useState<Movie | null>(() =>
    getRandomMovie(movies)
  );
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    if (!movies.length) return;

    if (nextMovie?.backdrop_path !== null || movie?.poster_path === null) {
      preloadImage(imageUrl(nextMovie?.backdrop_path as string));
      preloadImage(imageUrl(nextMovie?.poster_path as string));
    } else {
      setNextMovie(getRandomMovie(movies));
    }

    const interval = setInterval(() => {
      setMovie(nextMovie);
      let newMovie: Movie | null;

      do {
        newMovie = getRandomMovie(movies);
      } while (newMovie && newMovie.id === nextMovie?.id);

      setNextMovie(newMovie);
      setDirection((prev) => (prev === "right" ? "left" : "right"));
    }, intervalTime * time);

    return () => clearInterval(interval);
  }, [movies, movie, nextMovie]);

  return {
    time,
    movie,
    direction,
    intervalTime,
  };
};

export default useHero;
