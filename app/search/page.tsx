import ErrorPageComponent from '@/components/helpers/Error';
import React from 'react';
import Pagination from '@/components/utils/buttons/Pagination';
import { MovieCategoryEnum } from '../types/movies';
import { movieGenreId } from '@/lib/constants';
import SearchBar from '@/components/utils/SearchComponent';
import ListingCard from '@/components/utils/ListingCard';
import { SearchXIcon } from 'lucide-react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { search } from '../queries/queries';
import { cookies } from 'next/headers';
import { ListType } from '../types/utils';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page: string; q: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: `Movie Box | Search | ${q}`,
    description: 'Search for movies.',
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; q: string }> }) => {
  const { page, q } = (await searchParams) as {
    page: string;
    q: keyof typeof MovieCategoryEnum;
  };

  const type = (await cookies()).get('t')?.value as ListType;

  if (!q) redirect('/search?q=thor');

  try {
    const result = await search({ page: Number(page) || 1, query: q, type });

    if (!result.data) throw new Error(result.message);

    const movies = result.data?.results;
    const currentPage = result.data?.page;
    const totalPages = result.data?.total_pages;
    const totalResults = result.data?.total_results;

    return (
      <div className="container mx-auto py-10 px-3 md:px-[2rem] mt-[100px]">
        <div className="flex md:justify-between md:items-center mb-10 md:flex-row flex-col gap-3 md:gap-0">
          <h1 className="text-4xl font-bold">Search Results</h1>
          <SearchBar />
        </div>

        {q ? (
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
          <div className="flex justify-center items-center flex-col border border-dashed py-20 rounded-md bg-gray-900">
            <SearchXIcon size={50} className="mb-5 text-gray-400" />
            <h3 className="text-lg font-medium text-white mb-1">No search results</h3>
            <p className="text-gray-400 max-w-md text-center">
              Try searching for a movie to find what you&apos;re looking for.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
};

export default Page;
