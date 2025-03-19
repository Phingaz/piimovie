import React from "react";
import CarouselWrapper from "../carousel/CarouselWrapper";
import CarouselItem from "../carousel/CarouselItem";
import { imageCardUrl } from "@/lib/utils";
import ImageComponent from "../utils/ImageComponent";
import { getMovieImages } from "@/lib/queries";
import SectionTitle from "../utils/texts/SectionTitle";
import { ErrorMovieSection } from "../helpers/Error";

const Images = async ({ id }: { id: number }) => {
  try {
    const response = await getMovieImages({ id });
    if (!response.data) throw new Error(response.message);
    const images = response.data.backdrops;

    if (images.length < 1) return null;

    return (
      <div className="w-full">
        <SectionTitle>
          <>Images</>
        </SectionTitle>
        <CarouselWrapper hideButtons isLanding={false}>
          {images.map((el) => {
            return (
              <CarouselItem
                key={el.file_path}
                className="rounded-md carousel-item"
              >
                <ImageComponent
                  string={
                    el.file_path
                      ? imageCardUrl(el.file_path)
                      : "/placeholder.png"
                  }
                  title={el.file_path}
                />
              </CarouselItem>
            );
          })}
        </CarouselWrapper>
      </div>
    );
  } catch (error) {
    return <ErrorMovieSection error={error} title="Images" />;
  }
};

export default Images;
