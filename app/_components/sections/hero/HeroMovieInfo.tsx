import { PlayCircleIcon } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { Movie } from "@/app/types";
import { useRouter } from "next/navigation";

const HeroMovieInfo = ({ movie }: { movie: Movie | null }) => {
  const router = useRouter();
  return (
    <div className="max-w-3xl text-white drop-shadow-hero">
      <motion.h1
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.005 }}
        className="md:text-6xl text-5xl font-bold leading-tighter mb-5"
      >
        {movie?.title}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: -1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4"
      ></motion.div>
      <motion.p
        initial={{ opacity: 0, y: -1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "bounce" }}
        className="md:w-[70%] mb-10"
      >
        {movie?.overview}
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 justify-center items-center bg-[#981111] text-white px-5 py-3 rounded-md font-bold hover:bg-[#c51821] transition-all ease-in-out duration-300"
        onClick={() => router.push(`/movie/${movie?.id}`)}
      >
        <PlayCircleIcon /> Watch Trailer
      </motion.button>
    </div>
  );
};

export default HeroMovieInfo;
