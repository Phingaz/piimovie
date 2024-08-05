import React from "react";
import { SectionLoader } from "../../utils/Loader";
import { ErrorSection } from "../../utils/Error";
import useEmblaCarousel from "embla-carousel-react";
import Queries from "@/app/_context/Queries";
import LandingCard from "../../cards/LandingCard";

const Similar = () => {
  const { similar } = React.useContext(Queries);
  const { data, isLoading, isError } = similar;

  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
  });

  const movies = data?.results || [];

  return (
    <div className="my-5">
      <h2 className="text-lg md:text-2xl font-[600] mb-5">Similar Movies</h2>
      <div className="carousel-ref" ref={emblaRef}>
        <div className="carousel-wrapper-no-ml">
          {isLoading ? (
            <SectionLoader />
          ) : isError ? (
            <ErrorSection />
          ) : movies.length > 0 ? (
            movies.map((movie) => {
              return (
                <div key={movie.id} className={`carousel-item relative`}>
                  <LandingCard movie={movie} />
                </div>
              );
            })
          ) : (
            <p className="text-white">No similar movies found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Similar;
