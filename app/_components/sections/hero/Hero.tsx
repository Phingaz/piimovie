"use client";
import { Movie } from "@/app/types";
import { getRandomMovie } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import HeroMovieInfo from "./HeroMovieInfo";
import HeroMovieImg from "./HeroMovieImg";
import Queries from "@/app/_context/Queries";

const time = 20;
const intervalTime = 500;

const Hero = () => {
  const { getLandingMovies } = React.useContext(Queries);
  const { data } = getLandingMovies;
console.log("data", data);
  const randomMovie = getRandomMovie(data);

  const [movie, setMovie] = React.useState<Movie | null>(randomMovie);
  const [direction, setDirection] = React.useState<"left" | "right">("right");

  React.useEffect(() => {
    let interval = setInterval(() => {
      setMovie(randomMovie);
      setDirection((prev) => (prev === "right" ? "left" : "right"));
    }, intervalTime * time);

    return () => clearInterval(interval);
  }, [data, randomMovie]);

  return (
    <section className="h-[100svh] w-full">
      <div className="w-full h-full relative bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              ease: "easeInOut",
              duration: 1,
              repeat: Infinity,
              repeatDelay: (time * intervalTime) / 1000 - 1,
            },
          }}
          className="w-full h-full relative overflow-clip"
        >
          <div className="bg-black/40 absolute top-0 left-0 w-full h-full z-[1] flex items-center">
            <div className="container mx-auto">
              <HeroMovieInfo movie={movie} />
            </div>
          </div>
          <HeroMovieImg
            time={time}
            movie={movie}
            direction={direction}
            intervalTime={intervalTime}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
