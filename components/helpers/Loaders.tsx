"use client";
import useCarousel from "@/app/_hooks/useCarousel";
import { Loader2 } from "lucide-react";
import React from "react";
import CarouselItem from "../carousel/CarouselItem";

const Loader = () => {
  return (
    <div className="w-full h-full grid place-content-center">
      <Loader2 className="animate-spin text-white" />
    </div>
  );
};

const CarouselCardsLoader = ({ title }: { title: string }) => {
  const { emblaRef } = useCarousel();

  return (
    <div className="w-full mb-24">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl md:text-2xl font-[600] text-gray-300">
          {title}
        </h2>
      </div>
      <div className="carousel-ref" ref={emblaRef}>
        <div className="carousel-wrapper">
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="rounded-md carousel-item bg-gray-900 animate-pulse"
            >
              <></>
            </CarouselItem>
          ))}
        </div>
      </div>
    </div>
  );
};

const PageLoader = () => {
  return (
    <div className="w-full h-[100svh] bg-black grid place-content-center text-white">
      <div className="loader"></div>
      <p className="animate-pulse font-bold">Please wait</p>
    </div>
  );
};

export const ListingLoader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="h-[100svh] text-gray-100 pt-10 relative overflow-clip">
      <div className="absolute top-0 left-0 bg-black/40 w-full h-[100svh] z-1 flex justify-center items-center">
        <span className="flex flex-col justify-center items-center gap-3">
          <p>{description}</p>
          <Loader2 size={50} className="animate-spin" />
        </span>
      </div>
      <div className="container mx-auto py-10 md:py-20 px-3 md:px-[2rem]">
        <div className="flex md:justify-between md:items-center mb-10 md:flex-row flex-col gap-3 md:gap-0">
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-20 overflow-clip">
          {Array.from({ length: 10 })?.map((_, index) => {
            return (
              <div
                key={index}
                className="relative aspect-3/4 rounded-md border bg-gray-900 animate-pulse border-gray-700/80 shadow-sm shadow-gray-700/80"
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const DownloadLoader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-bg h-[100svh] text-gray-100 pt-10 relative overflow-clip">
      <div className="absolute top-0 left-0 bg-black/40 w-full h-[100svh] z-1 flex justify-center items-center">
        <span className="flex flex-col justify-center items-center gap-3">
          <p>{description}</p>
          <Loader2 size={50} className="animate-spin" />
        </span>
      </div>
      <div className="container mx-auto py-10 md:py-20 px-3 md:px-[2rem]">
        <div className="flex md:justify-between md:items-center mb-10 md:flex-row flex-col gap-3 md:gap-0">
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>
        <div className="grid md:gap-y-5 gap-3 mb-10">
          {Array.from({ length: 10 })?.map((_, index) => {
            return (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-3 hover:bg-gray-750 duration-200 border border-gray-900 shadow shadow-gray-500 hover:scale-[1.01] transition-all h-[80px]"
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { Loader, CarouselCardsLoader, PageLoader };
