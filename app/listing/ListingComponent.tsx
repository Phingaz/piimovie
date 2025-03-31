import ErrorPageComponent from '@/components/helpers/Error';
import { cookies } from 'next/headers';
import React from 'react';
import { getListing } from '../queries/queries';
import { ListType } from '../types/utils';
import { MovieCategory, MovieCategoryEnum } from '../types/movies';
import SelectComponentUrl from '@/components/utils/Select';
import SearchBar from '@/components/utils/SearchComponent';
import ListingCard from '@/components/utils/ListingCard';
import { MovieCategoryOptions, movieGenreId, TvCategoryOptions } from '@/lib/constants';
import Pagination from '@/components/utils/buttons/Pagination';
import PageSection from '@/components/utils/texts/PageSection';
import PageTitle from '@/components/utils/texts/PageTitle';

const ListingComponent = async ({ category, page }: { category: MovieCategory; page: string }) => {
  try {
    const type = (await cookies()).get('t')?.value as ListType;
    const result = await getListing({ category, page: Number(page) || 1, type });

    if (!result.data) throw new Error(result.message);

    const movies = result.data?.results;
    const currentPage = result.data?.page;
    const totalPages = result.data?.total_pages;
    const totalResults = result.data?.total_results;
    const title = MovieCategoryEnum[category];

    return (
      <div className="container mx-auto mt-[100px] md-5 md:py-10 px-3 md:px-[2rem] relative">
        <PageSection>
          <PageTitle>{title}</PageTitle>
          <div className="flex md:flex-row flex-col gap-2 md:items-center mt-5 md:mt-0">
            <SelectComponentUrl
              defaultValue={category}
              options={type === 'movie' ? MovieCategoryOptions : TvCategoryOptions}
            />
            <SearchBar />
          </div>
        </PageSection>{' '}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-x-8 md:gap-y-10 gap-3 mb-10 md:mb-20">
          {movies?.map((movie) => {
            const genres = movieGenreId
              .filter((genre) => movie.genre_ids.includes(genre.id))
              .map((genre) => genre.name)
              .join(', ');

            return <ListingCard key={movie.id} genres={genres} type={type} movie={movie} />;
          })}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} totalResults={totalResults} />
      </div>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
};

export default ListingComponent;
