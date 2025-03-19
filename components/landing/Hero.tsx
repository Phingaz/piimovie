import { Movie } from "@/app/types";
import React from "react";
import HeroMovieInfo from "./HeroMovieInfo";
import HeroMovieImg from "./HeroMovieImage";

const Hero = ({ movies = [] }: { movies?: Movie[] }) => {
  if (!movies) return null;

  return (
    <section className="w-full relative">
      <HeroMovieImg movies={movies} />
      <HeroMovieInfo movies={movies} />
    </section>
  );
};

export default Hero;
