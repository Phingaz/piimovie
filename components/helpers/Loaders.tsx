'use client';
import useCarousel from '@/app/_hooks/useCarousel';
import { Loader2 } from 'lucide-react';
import React from 'react';
import CarouselItem from '../carousel/CarouselItem';

interface LoaderProps {
  className?: string;
  size?: number;
}

interface PageLoaderProps {
  title?: string;
  description?: string;
  variant?: 'fullscreen' | 'overlay';
  className?: string;
}

interface ContentLoaderProps {
  title: string;
  description: string;
  variant?: 'listing' | 'download';
  className?: string;
}

// Basic spinner loader
const Loader = ({ className = '', size = 24 }: LoaderProps) => {
  return (
    <div className={`w-full h-full grid place-content-center ${className}`}>
      <Loader2 className="animate-spin text-white" style={{ width: size, height: size }} />
    </div>
  );
};

// Carousel skeleton loader
const CarouselCardsLoader = ({ title }: { title: string }) => {
  const { emblaRef } = useCarousel();

  return (
    <div className="w-full mb-24">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl md:text-2xl font-[600] text-gray-300">{title}</h2>
      </div>
      <div className="carousel-ref" ref={emblaRef}>
        <div className="carousel-wrapper">
          {Array.from({ length: 10 }).map((_, index) => (
            <CarouselItem key={index} className="rounded-md carousel-item bg-gray-800 animate-pulse">
              <></>
            </CarouselItem>
          ))}
        </div>
      </div>
    </div>
  );
};

// Full page loader
const PageLoader = ({
  title = 'Please wait',
  description,
  variant = 'fullscreen',
  className = '',
}: PageLoaderProps) => {
  if (variant === 'fullscreen') {
    return (
      <div className={`w-full h-[100svh] bg-[#000] grid place-content-center text-white ${className}`}>
        <div className="loader"></div>
        <p className="animate-pulse font-bold">{title}</p>
        {description && <p className="text-sm text-gray-400 mt-2">{description}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col justify-center items-center gap-3 ${className}`}>
      <p>{description || title}</p>
      <Loader2 size={50} className="animate-spin" />
    </div>
  );
};

// Card grid skeleton
export const LoadingCard = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-20 overflow-clip">
      {Array.from({ length: 20 })?.map((_, index) => {
        return (
          <div
            key={index}
            className="relative aspect-3/4 rounded-md border bg-gray-900 animate-pulse border-gray-700/80 shadow-sm shadow-gray-700/80"
          ></div>
        );
      })}
    </div>
  );
};

// Unified content loader for pages with content
const UnifiedContentLoader = ({ title, description, variant = 'listing', className = '' }: ContentLoaderProps) => {
  const isDownload = variant === 'download';

  return (
    <div
      className={`text-gray-100 pt-10 relative overflow-clip ${isDownload ? 'bg-bg h-[100svh]' : 'mt-[50px]'} ${className}`}
    >
      <div
        className={`absolute top-0 left-0 w-full z-1 flex justify-center items-center ${
          isDownload ? 'bg-black/40 h-[100svh]' : 'bg-black/30 h-[100svh]'
        }`}
      >
        <PageLoader variant="overlay" description={description} />
      </div>
      <div className={`container mx-auto px-3 md:px-[2rem] ${isDownload ? 'py-10 md:py-20' : 'py-10'}`}>
        <div className="flex md:justify-between md:items-center mb-10 md:flex-row flex-col gap-3 md:gap-0">
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>

        {isDownload ? (
          <div className="grid md:gap-y-5 gap-3 mb-10">
            {Array.from({ length: 10 })?.map((_, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-3 hover:bg-gray-750 duration-200 border border-gray-900 shadow shadow-gray-500 hover:scale-[1.01] transition-all h-[80px] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <LoadingCard />
        )}
      </div>
    </div>
  );
};

// Legacy components for backward compatibility
export const ListingLoader = ({ title, description }: { title: string; description: string }) => (
  <UnifiedContentLoader title={title} description={description} variant="listing" />
);

export const DownloadLoader = ({ title, description }: { title: string; description: string }) => (
  <UnifiedContentLoader title={title} description={description} variant="download" />
);

export { Loader, CarouselCardsLoader, PageLoader, UnifiedContentLoader };
