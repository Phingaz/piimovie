'use client';
import React from 'react';
import { LocalSearch } from '@/components/utils/SearchComponent';
import { useFavoriteCtx } from '../_context/Favorite';
import LandingCard from '@/components/landing/LandingMovieCard';
import { SearchXIcon } from 'lucide-react';
import { Movie } from '../types/movies';
import { movie } from '@prisma/client';
import { useMainCtx } from '../_context/Main';

const Page = () => {
  const { user } = useMainCtx();

  const { fav: movies } = useFavoriteCtx();
  const [filteredResults, setFilteredResults] = React.useState<movie[] | null>(
    typeof window !== 'undefined' ? movies : null,
  );

  return (
    <div className="container mx-auto py-10 mt-[70px] px-3 md:px-[2rem]">
      <div className="flex md:justify-between md:items-center mb-10 md:flex-row flex-col gap-3 md:gap-0">
        <h1 className="text-4xl font-bold">Favorite</h1>
        <LocalSearch data={movies} setFilteredResults={setFilteredResults} />
      </div>
      {!user ? (
        <div className="flex justify-center items-center flex-col border border-dashed py-20 rounded-md bg-gray-900">
          <SearchXIcon size={50} className="mb-5 text-gray-400" />
          <h3 className="text-lg font-medium text-white mb-1">Sign in to continue</h3>
          <p className="text-gray-400 max-w-md text-center">Please sign in to manage your favorite movies</p>
        </div>
      ) : filteredResults && filteredResults.length <= 1 ? (
        <div className="flex justify-center items-center flex-col border border-dashed py-20 rounded-md bg-gray-900">
          <SearchXIcon size={50} className="mb-5 text-gray-400" />
          <h3 className="text-lg font-medium text-white mb-1">No favorites</h3>
          <p className="text-gray-400 max-w-md text-center">Try adding a movie as favorite to add it to this list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-20">
          {filteredResults?.map((movie) => {
            return <LandingCard key={movie.id} type="movie" movie={movie as unknown as Movie} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Page;
