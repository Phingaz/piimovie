'use client';
import React from 'react';
import { LocalSearch } from '@/components/utils/SearchComponent';
import { useFavoriteCtx } from '../_context/Favorite';
import LandingCard from '@/components/landing/LandingMovieCard';
import { SearchXIcon } from 'lucide-react';

const Page = () => {
  const { favMovies: movies } = useFavoriteCtx();
  const [filteredResults, setFilteredResults] = React.useState(typeof window !== 'undefined' ? movies : []);
  console.log(filteredResults);
  return (
    <div className="container mx-auto py-10 px-3 md:px-[2rem]">
      <div className="flex md:justify-between md:items-center mb-10 md:flex-row flex-col gap-3 md:gap-0">
        <h1 className="text-4xl font-bold">Favorite</h1>
        <LocalSearch data={movies} setFilteredResults={setFilteredResults} />
      </div>
      {filteredResults.length >= 1 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-20">
          {filteredResults?.map((movie) => {
            return <LandingCard key={movie.id} movie={movie} />;
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col border border-dashed py-20 rounded-md bg-gray-900">
          <SearchXIcon size={50} className=" text-gray-400" />
          <h3 className="text-lg font-medium text-white mb-2">No favorites</h3>
          <p className="text-gray-400 max-w-md text-center">Try adding a movie as favorite to add it to this list.</p>
        </div>
      )}
    </div>
  );
};

export default Page;
