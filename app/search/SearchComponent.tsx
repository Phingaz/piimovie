import ErrorPageComponent from '@/components/helpers/Error';
import Pagination from '@/components/utils/buttons/Pagination';
import ListingCard from '@/components/utils/ListingCard';
import SearchBar from '@/components/utils/SearchComponent';
import { SearchXIcon } from 'lucide-react';
import React from 'react';
import { searchPerPage } from '../_queries/queries';
import { movieGenres } from '@/lib/arrays';
import { Movie } from '../_types/movies';
import { Show } from '../_types/show';
import { ListType } from '../_types/utils';
import PageTitle from '@/components/utils/texts/PageTitle';
import PageSection from '@/components/utils/texts/PageSection';
import PerPageSelector from '@/components/utils/PerPageSelector';

const SearchComponent = async ({ q, type, page, per }: { q: string; type: ListType; page: string; per?: string }) => {
  try {
    const perPage = Number(per) || 20;
    const requestedPage = Number(page) || 1;

    const resp = (await searchPerPage({ query: q, type, page: requestedPage, per: perPage })) as {
      data: { page: number; results: Array<Movie | Show>; total_pages: number; total_results: number };
      success?: boolean;
      message?: string;
    };
    if (!resp || !resp.data) throw new Error(resp?.message || 'Failed to fetch');

    const movies: Array<Movie | Show> = resp.data.results || [];
    const currentPage = resp.data.page || requestedPage;
    const totalPages = resp.data.total_pages || 1;
    const totalResults = resp.data.total_results || movies.length;

    return (
      <div className="container mx-auto py-10 px-3 md:px-[2rem] mt-[100px]">
        <PageSection>
          <PageTitle className="text-4xl font-bold">Search Results</PageTitle>
          <div className="flex items-end gap-4">
            <SearchBar />
            <PerPageSelector />
          </div>
        </PageSection>

        {!q ? (
          <EmptySearch />
        ) : movies.length >= 1 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-20">
              {movies?.map((movie) => {
                const genres = movieGenres
                  .filter((genre) => movie.genre_ids?.includes(Number(genre.value)))
                  .map((genre) => genre.label)
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
