import React from "react";
import { SectionLoader } from "../../utils/Loader";
import { ErrorSection } from "../../utils/Error";
import useEmblaCarousel from "embla-carousel-react";
import Queries from "@/app/_context/Queries";
import CollectionCard from "../../cards/CollectionCard";
import { movieGenreId } from "@/app/constants";

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
              const genres = movieGenreId
                .filter((genre) => movie.genre_ids.includes(genre.id))
                .map((genre) => genre.name)
                .join(", ");

              return (
                <div key={movie.id} className={`carousel-item relative`}>
                  <CollectionCard movie={movie} genres={genres} />
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
