"use client";
import React from "react";
import useCarousel from "@/app/_hooks/useCarousel";
import CarouselBtns from "./CarouselBtns";

const CarouselWrapper = ({
  hideButtons = false,
  children,
  isLanding,
}: {
  hideButtons?: boolean;
  isLanding?: boolean;
  children: React.ReactNode;
}) => {
  const { emblaApi, emblaRef } = useCarousel();

  return (
    <div className="relative">
      <CarouselBtns
        hideButtons={hideButtons}
        isLanding={isLanding}
        emblaApi={emblaApi}
      />
      <div className="carousel-ref" ref={emblaRef}>
        <div className="carousel-wrapper">{children}</div>
      </div>
    </div>
  );
};

export default CarouselWrapper;
