import React, { Suspense } from 'react';
import { MovieCategoryEnum } from '../types/movies';
import { Metadata } from 'next';
import DownloadComponent from './DownloadComponent';
import PageLoader from './loading';

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

  return (
    <Suspense key={JSON.stringify({ page, q })} fallback={<PageLoader />}>
      <DownloadComponent page={page} q={q} />
    </Suspense>
  );
};

export default Page;
