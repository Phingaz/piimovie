import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const HeroMovieImg = ({
  movie,
  direction,
  time,
  intervalTime,
}: {
  movie: any;
  direction: string;
  time: number;
  intervalTime: number;
}) => {
  if (!movie) return null;

  return (
    <React.Fragment>
      <motion.div
        initial={{ x: "0%" }}
        animate={{
          x: direction === "left" ? ["0%", `-10%`] : ["0%", `10%`],
          transition: {
            ease: "linear",
            duration: (time * intervalTime) / 1000,
            repeat: Infinity,
          },
        }}
        className="w-full h-full relative"
      >
        <Image
          fill
          priority
          alt={movie.title}
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="scale-[1.2] object-top object-cover w-full h-full absolute"
        />
      </motion.div>
    </React.Fragment>
  );
};

export default HeroMovieImg;
