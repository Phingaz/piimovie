import ErrorPageComponent from '@/components/helpers/Error';
import React from 'react';
import { fetchDiscover } from '../_queries/queries';
import { ListType, FilterOption } from '../_types/utils';
import SearchBar from '@/components/utils/SearchComponent';
import ListingCard from '@/components/utils/ListingCard';
import { movieGenres } from '@/lib/arrays';
import Pagination from '@/components/utils/buttons/Pagination';
import PageSection from '@/components/utils/texts/PageSection';
import PageTitle from '@/components/utils/texts/PageTitle';
import { FilterSection } from '@/components/utils/Filter';
import { MobileFilter } from '@/components/utils/FilterHelpers';
import { SearchXIcon } from 'lucide-react';
import { getQueryString } from '@/lib/utils';

const ListingComponent = async ({ data, type }: { data: FilterOption; type: ListType }) => {
  try {
    const params = getQueryString(data);
    const result = await fetchDiscover({ type, params });

    if (!result.data) throw new Error(result.message);

    const movies = result.data?.results;
    const currentPage = result.data?.page;
    const totalPages = result.data?.total_pages;
    const totalResults = result.data?.total_results;

    return (
      <div className="container mx-auto mt-[100px] md-5 md:py-10 px-3 md:px-[2rem] relative">
        <div className="flex gap-8 mb-10 md:mb-20">
          <FilterSection className="col-span-2 hidden lg:block min-w-[300px] max-w-[300px]" />
          <div className="col-span-8 w-full">
            <PageSection className="lg:justify-between lg:items-center gap-5 lg:flex-row flex-col mb-0 md:mb-0">
              <PageTitle className="capitalize shrink-0">{`${type} listing`}</PageTitle>
              <div className="flex flex-row justify-between gap-2 items-end lg:items-center">
                <MobileFilter />
                <SearchBar className="md:min-w-[410px] w-[400px]" />
              </div>
            </PageSection>
            {movies.length === 0 ? (
              <EmptyResult />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mt-5">
                {movies?.map((movie) => {
                  const genres = movieGenres
                    .filter((genre) => movie.genre_ids?.includes(Number(genre.value)))
                    .map((genre) => genre.label)
                    .join(', ');

                  return <ListingCard key={movie.id} genres={genres} type={type} movie={movie} />;
                })}
              </div>
            )}
          </div>
        </div>
        {movies.length >= 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} totalResults={totalResults} />
        )}
      </div>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
};

export default ListingComponent;

const EmptyResult = () => {
  return (
    <div className="h-[calc(100svh-250px)] flex justify-center items-center flex-col border border-gray-500/50 border-dashed py-20 rounded-md bg-gray-900 mt-5">
      <SearchXIcon size={70} className="mb-3 text-gray-400" />
      <h3 className="text-lg font-medium text-white mb-2">Empty result</h3>
      <p className="text-gray-400 max-w-md text-center">
        No results found. Please modify your filter options and try again.
      </p>
    </div>
  );
};
