import React, { Suspense } from 'react';

import { Metadata } from 'next';
import DownloadComponent from './DownloadComponent';
import PageLoader from './loading';
import { MovieCategoryEnum } from '@/lib/enums';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page: string; q: string }>;
}): Promise<Metadata> {
  const { q } = (await searchParams) as { q: keyof typeof MovieCategoryEnum };

  return {
    title: `Movie Box | Download | ${q}`,
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
