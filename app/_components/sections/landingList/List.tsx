import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Movie, MovieResponse } from "@/app/types";
import { UseQueryResult } from "@tanstack/react-query";
import { SectionLoader } from "../../utils/Loader";
import Link from "next/link";
import LandingCard from "../../cards/LandingCard";
import { ErrorSection } from "../../utils/Error";

const List = ({
  movieCtx,
  title,
  category,
}: {
  movieCtx: UseQueryResult<MovieResponse, Error>;
  title: string;
  category: string;
}) => {
  const { data, isLoading, isError } = movieCtx;

  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
  });

  if (isError) return <div>Error</div>;

  const movies = data?.results || [];

  return (
    <div className="w-full text-white">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl md:text-3xl font-[600]">{title}</h2>
        <Link
          className="text-sm font-[500] transition hover:text-accent-brighter"
          href={`/moviecollection?list=${category}&page=1`}
        >
          See more
        </Link>
      </div>

      <div className="carousel-ref" ref={emblaRef}>
        <div className="carousel-wrapper">
          {isLoading ? (
            <SectionLoader />
          ) : isError ? (
            <ErrorSection />
          ) : (
            movies.map((movie, index) => (
              <LandingCard key={index} movie={movie} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
