import ErrorPageComponent from '@/components/helpers/Error';
import Pagination from '@/components/utils/buttons/Pagination';
import ListingCard from '@/components/utils/ListingCard';
import SearchBar from '@/components/utils/SearchComponent';
import { SearchXIcon } from 'lucide-react';
import React from 'react';
import { search } from '../queries/queries';
import { movieGenreId } from '@/lib/constants';
import { ListType } from '../types/utils';
import PageTitle from '@/components/utils/texts/PageTitle';
import PageSection from '@/components/utils/texts/PageSection';

const SearchComponent = async ({ q, type, page }: { q: string; type: ListType; page: string }) => {
  try {
    const result = await search({ page: Number(page) || 1, query: q, type });

    if (!result.data) throw new Error(result.message);

    const movies = result.data?.results;
    const currentPage = result.data?.page;
    const totalPages = result.data?.total_pages;
    const totalResults = result.data?.total_results;

    return (
      <div className="container mx-auto py-10 px-3 md:px-[2rem] mt-[100px]">
        <PageSection>
          <PageTitle className="text-4xl font-bold">Search Results</PageTitle>
          <SearchBar />
        </PageSection>

        {!q ? (
          <EmptySearch />
        ) : movies.length >= 1 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-20">
              {movies?.map((movie) => {
                const genres = movieGenreId
                  .filter((genre) => movie.genre_ids?.includes(genre.id))
                  .map((genre) => genre.name)
                  .join(', ');

                return <ListingCard key={movie.id} type={type} genres={genres} movie={movie} />;
              })}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} totalResults={totalResults} />
          </>
        ) : (
          <EmptySearch />
        )}
      </div>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
};

export default SearchComponent;

const EmptySearch = () => {
  return (
    <div className="h-[calc(100svh-250px)] flex justify-center items-center flex-col border border-gray-500/50 border-dashed py-20 rounded-md bg-gray-900">
      <SearchXIcon size={70} className="mb-3 text-gray-400" />
      <h3 className="text-lg font-medium text-white mb-1">No search results</h3>
      <p className="text-gray-400 max-w-md text-center">
        Try searching for a movie to find what you&apos;re looking for.
      </p>
    </div>
  );
};
