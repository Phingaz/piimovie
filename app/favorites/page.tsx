'use client';
import React, { useState, useEffect } from 'react';
import { LocalSearch } from '@/components/utils/SearchComponent';
import { useDbPropsCtx } from '../_context/DbProps';
import LandingCard from '@/components/landing/LandingMovieCard';
import { SearchXIcon } from 'lucide-react';
import { Movie } from '../_types/movies';
import { movie } from '@prisma/client';
import { useMainCtx } from '../_context/Main';
import { ListType } from '../_types/utils';
import { SelectComponent } from '@/components/utils/Select';
import { favSortOptions, favFilterType } from '@/lib/arrays';
import PageTitle from '@/components/utils/texts/PageTitle';
import PageSection from '@/components/utils/texts/PageSection';
import useLocalStorage from '../_hooks/useLocalStorage';
import { useBulkHQStatus } from '../_hooks/useHQStatus';
import HQBadge from '@/components/ui/HQBadge';
// import { syncUserMovieRatings } from '../_queries/queries';

const Page = () => {
  const { user } = useMainCtx();
  const { fav: movies } = useDbPropsCtx();

  const [filterType, setFilterType] = useState<string | null>('all');
  const [searchResults, setSearchResults] = useState<movie[] | null>(movies);
  const [filteredResults, setFilteredResults] = useState<movie[] | null>(movies);
  const [sortOrder, setSortOrder] = useLocalStorage<string | null>('favSortOrder', 'desc');

  useEffect(() => {
    if (searchResults) {
      let results = filterType === 'all' ? searchResults : searchResults.filter((el) => el.type === filterType);

      results = [...results].sort((a, b) => {
        if (sortOrder === 'desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      setFilteredResults(results);
    }
  }, [searchResults, sortOrder, filterType]);

  const { checkMultipleHQ, hqStatuses, loading: hqLoading } = useBulkHQStatus();

  useEffect(() => {
    if (filteredResults && filteredResults.length > 0) {
      const movieTitles = filteredResults.map((movie) => movie.title);
      checkMultipleHQ(movieTitles);
    }
  }, [filteredResults, checkMultipleHQ]);

  // useEffect(() => {
  //   async function m() {
  //     if (user) {
  //       syncUserMovieRatings(user, { maxAge: 24, batchSize: 10 });
  //     }
  //   }

  //   m();
  // });

  return (
    <div className="container mx-auto py-10 mt-[70px] px-3 md:px-[2rem]">
      <PageSection>
        <PageTitle>Favorite</PageTitle>
        <div className="flex md:flex-row flex-col gap-2 md:items-center">
          <SelectComponent value={sortOrder} setValue={setSortOrder} options={favSortOptions} />
          <SelectComponent value={filterType} setValue={setFilterType} options={favFilterType} />
          <LocalSearch data={movies} setFilteredResults={setSearchResults} />
        </div>
      </PageSection>
      {!user ? (
        <div className="flex h-[calc(100svh-225px)] border-gray-500/50 justify-center items-center flex-col border border-dashed py-20 rounded-md bg-gray-900">
          <SearchXIcon size={50} className="mb-5 text-gray-400" />
          <h3 className="text-lg font-medium text-white mb-1">Sign in to continue</h3>
          <p className="text-gray-400 max-w-md text-center">Please sign in to manage your favorite movies</p>
        </div>
      ) : filteredResults && filteredResults.length === 0 ? (
        <div className="flex h-[calc(100svh-225px)] border-gray-500/50 justify-center items-center flex-col border border-dashed py-20 rounded-md bg-gray-900">
          <SearchXIcon size={50} className="mb-5 text-gray-400" />
          <h3 className="text-lg font-medium text-white mb-1">No favorites</h3>
          <p className="text-gray-400 max-w-md text-center">Try adding a movie as favorite to add it to this list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-20">
          {filteredResults?.map((movie) => (
            <div key={movie.id} className="relative">
              <HQBadge hasHQ={hqStatuses[movie.title]} loading={hqLoading} />
              <LandingCard type={movie.type as ListType} movie={movie as unknown as Movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
