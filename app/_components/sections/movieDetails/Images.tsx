import Queries from "@/app/_context/Queries";
import React from "react";
import { ErrorSection } from "../../utils/Error";
import { SectionLoader } from "../../utils/Loader";

import useEmblaCarousel from "embla-carousel-react";
import ImageComponent from "../../utils/ImageComponent";

const Images = () => {
  const { movieImg } = React.useContext(Queries);
  const { data, isLoading, isError } = movieImg;

  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
  });

  const images = data?.backdrops || [];

  return (
    <div className="my-5 max-w-[500px]">
      <h2 className="text-lg md:text-2xl font-[600] mb-5">Posters & images</h2>
      <div className="carousel-ref" ref={emblaRef}>
        <div className="carousel-wrapper-no-ml">
          {isLoading ? (
            <SectionLoader />
          ) : isError ? (
            <ErrorSection />
          ) : images.length > 0 ? (
            images.map((image) => (
              <div key={image.file_path} className="carousel-item">
                <ImageComponent
                  width={500}
                  height={500}
                  title={image.file_path}
                  string={image.file_path}
                />
              </div>
            ))
          ) : (
            <p className="text-white">No similar movies found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Images;
