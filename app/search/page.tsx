import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ListType } from '../_types/utils';
import SearchComponent from './SearchComponent';
import PageLoader from './loading';
import { MovieCategoryEnum } from '@/lib/enums';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page: string; q: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: `Movie Box | Search ${q ? `| ${q}` : ''}`,
    description: 'Search for movies.',
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; q: string }> }) => {
  const { page, q } = (await searchParams) as {
    page: string;
    q: keyof typeof MovieCategoryEnum;
  };

  const type = (await cookies()).get('t')?.value as ListType;

  return (
    <Suspense key={JSON.stringify({ q, page })} fallback={<PageLoader />}>
      <SearchComponent q={q} page={page} type={type} />
    </Suspense>
  );
};

export default Page;
