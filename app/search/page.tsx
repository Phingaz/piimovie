import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ListType } from '../_types/utils';
import SearchComponent from './SearchComponent';
import PageLoader from './loading';
import { MovieCategoryEnum } from '@/lib/enums';
import { ErrorBoundary } from '@/components/helpers/ErrorBoundary';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page: string; q: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;

  const title = `Search Results${q ? ` for "${q}"` : ''}`;
  const description = q
    ? `Search results for "${q}". Find movies and TV shows matching your query.`
    : 'Search for your favorite movies and TV shows. Discover new content and find detailed information about any title.';

  return {
    title,
    description,
    robots: 'noindex, follow',
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; q: string }> }) => {
  const { page, q } = (await searchParams) as {
    page: string;
    q: keyof typeof MovieCategoryEnum;
  };

  const type = (await cookies()).get('t')?.value as ListType;

  return (
    <ErrorBoundary>
      <Suspense key={JSON.stringify({ q, page })} fallback={<PageLoader />}>
        <SearchComponent q={q} page={page} type={type} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Page;
