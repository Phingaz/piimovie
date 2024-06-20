"use client";
import React from "react";
import List from "./List";
import Queries from "@/app/_context/Queries";
import Main from "@/app/_context/Main";

const LandingList = () => {
  const { getLandingMovies, popularMovies, topRatedMovies, upcomingMovies } =
    React.useContext(Queries);

  const movieCategoryEnums = [
    { title: "Now Playing", category: "now_playing", ctx: getLandingMovies },
    { title: "Popular", category: "popular", ctx: popularMovies },
    { title: "Upcoming", category: "upcoming", ctx: upcomingMovies },
    { title: "Top Rated", category: "top_rated", ctx: topRatedMovies },
  ];

  return (
    <section className="min-h-[100svh] bg-bg bg-gradient">
      <div className="container mx-auto py-10 md:py-20 flex flex-col gap-10 md:gap-16">
        {movieCategoryEnums.map((category, index) => (
          <List
            key={index}
            title={category.title}
            category={category.category}
            movieCtx={category.ctx}
          />
        ))}
      </div>
    </section>
  );
};

export default LandingList;
