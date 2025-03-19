import ErrorPageComponent from '@/components/helpers/Error';
import { getMovies } from '@/lib/queries';
import React from 'react';
import Pagination from '@/components/utils/buttons/Pagination';
import { MovieTypeEnum } from '../types';
import { movieGenreId } from '@/lib/constants';
import SearchBar from '@/components/utils/SearchComponent';
import ListingCard from '@/components/utils/ListingCard';
import { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ list: string }>;
}): Promise<Metadata> {
  const { list } = await searchParams;
  const title = MovieTypeEnum[list as keyof typeof MovieTypeEnum];

  return {
    title: `Movie Box | Movies | ${title}`,
    description: `Movie listing for ${title}`,
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; list: string }> }) => {
  const { page, list } = (await searchParams) as {
    page: string;
    list: keyof typeof MovieTypeEnum;
  };

  // await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const result = await getMovies({ page: Number(page) || 1, type: list });

    if (!result.data) throw new Error(result.message);

    const movies = result.data?.results;
    const currentPage = result.data?.page;
    const totalPages = result.data?.total_pages;
    const totalResults = result.data?.total_results;
    const title = MovieTypeEnum[list];

    return (
      <div className="container mx-auto md-5 md:py-10 px-3 md:px-[2rem] relative">
        <div className="flex md:justify-between md:items-center mb-10 md:flex-row flex-col gap-3 md:gap-0">
          <h1 className="text-3xl md:text-4xl font-[600]">{title}</h1>
          <SearchBar />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-10 md:mb-20">
          {movies?.map((movie) => {
            const genres = movieGenreId
              .filter((genre) => movie.genre_ids.includes(genre.id))
              .map((genre) => genre.name)
              .join(', ');

            return <ListingCard key={movie.id} genres={genres} movie={movie} />;
          })}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} totalResults={totalResults} />
      </div>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
};

export default Page;
