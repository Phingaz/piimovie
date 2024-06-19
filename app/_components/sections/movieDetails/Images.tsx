import Queries from "@/app/_context/Queries";
import React from "react";
import { ErrorSection } from "../../utils/Error";
import { SectionLoader } from "../../utils/Loader";

import useEmblaCarousel from "embla-carousel-react";
import ImageComponent from "../../utils/ImageComponent";
import Modal from "../../utils/Modal";

const Images = () => {
  const { movieImg } = React.useContext(Queries);
  const { data, isLoading, isError } = movieImg;

  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
  });

  const images = data?.backdrops || [];

  return (
    <div className="my-5 w-full">
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
                <Modal
                  trigger={
                    <ImageComponent
                      width={500}
                      height={500}
                      title={image.file_path}
                      string={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                    />
                  }
                  content={
                    <ImageComponent
                      unoptimized
                      width={0}
                      height={0}
                      title={image.file_path}
                      string={`https://image.tmdb.org/t/p/original/${image.file_path}`}
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
                  }
                ></Modal>
              </div>
            ))
          ) : (
            <p className="text-white">No images found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Images;
