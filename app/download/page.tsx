import ErrorPageComponent from '@/components/helpers/Error';
import React from 'react';
import { MovieCategoryEnum } from '../types/movies';
import SearchBar from '@/components/utils/SearchComponent';
import TorrentItem from '@/components/utils/TorrentCard';
import SimplePagination from '@/components/utils/buttons/SimplePagination';
import { DownloadIcon } from 'lucide-react';
import { Metadata } from 'next';
import { searchMoviesForDownload } from '../queries/movies';

export function generateMetadata(): Metadata {
  return {
    title: `Movie Box | Download | Torrent`,
    description: 'Find and torrent anything.',
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; q: string }> }) => {
  const { page, q } = (await searchParams) as {
    page: string;
    q: keyof typeof MovieCategoryEnum;
  };

  try {
    const result = await searchMoviesForDownload({
      page: Number(page) || 1,
      query: q,
    });

    if (!result.data) throw new Error(result.message);

    const list = result.data?.data;

    return (
      <div className="container mx-auto mt-[70px] py-10 px-3 md:px-[2rem]">
        <div className="flex md:justify-between md:items-center mb-10 md:flex-row flex-col gap-3 md:gap-0">
          <h1 className="text-4xl font-bold">Download</h1>
          <SearchBar path="download" />
        </div>
        {q ? (
          <>
            <div className="grid md:gap-y-5 gap-3 mb-10">
              {list?.map((el) => {
                return <TorrentItem key={el.hash} torrent={el} />;
              })}
            </div>
            <SimplePagination currentPage={Number(page) || 1} />
          </>
        ) : (
          <div className="flex justify-center items-center flex-col border border-dashed py-20 rounded-md bg-gray-900">
            <DownloadIcon size={50} className="mb-5 text-gray-400" />
            <h3 className="text-lg font-medium text-white mb-1">No download results</h3>
            <p className="text-gray-400 max-w-md text-center">
              Try searching for movies, actors, directors, or genres to find what you&apos;re looking for.
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
