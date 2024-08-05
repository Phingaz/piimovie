import Queries from "@/app/_context/Queries";
import React from "react";
import { ErrorSection } from "../../utils/Error";
import { SectionLoader } from "../../utils/Loader";

import useEmblaCarousel from "embla-carousel-react";
import ImageComponent from "../../utils/ImageComponent";
import Modal from "../../utils/Modal";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Images = () => {
  const { movieImg } = React.useContext(Queries);
  const { data, isLoading, isError } = movieImg;

  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
  });

  const images = data?.backdrops || [];
  const [currentIndex, setCurrentIndex] = React.useState(0);
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
            images.map((image, index) => {
              return (
                <div key={image.file_path} className="carousel-item">
                  <Modal
                    trigger={
                      <ImageComponent
                        width={500}
                        height={500}
                        title={image.file_path}
                        string={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                        onClick={() => setCurrentIndex(index)}
                      />
                    }
                    content={
                      <div className="relative w-full h-full">
                        <ImageComponent
                          title={image.file_path}
                          string={`https://image.tmdb.org/t/p/original/${images[currentIndex].file_path}`}
                          className="w-full h-full object-cover object-center rounded-lg"
                        />

                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-between items-center px-3">
                          <button
                            className="grid place-content-center text-lg text-white bg-gray-700 bg-opacity-50 p-1 rounded-full"
                            onClick={() =>
                              setCurrentIndex((prev) => {
                                if (prev === 0) return images.length - 1;
                                return prev - 1;
                              })
                            }
                          >
                            <ChevronLeft />
                          </button>
                          <button
                            className="grid place-content-center text-lg text-white bg-gray-700 bg-opacity-50 p-1 rounded-full"
                            onClick={() =>
                              setCurrentIndex((prev) => {
                                if (prev === images.length - 1) return 0;
                                return prev + 1;
                              })
                            }
                          >
                            <ChevronRight />
                          </button>
                        </div>
                      </div>
                    }
                  ></Modal>
                </div>
              );
            })
          ) : (
            <p className="text-white">No images found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Images;
