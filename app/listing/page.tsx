import React, { Suspense } from 'react';
import { MovieCategoryEnum } from '../types/movies';
import { Metadata } from 'next';
import { ListType } from '../types/utils';
import { cookies } from 'next/headers';
import ListingComponent from './ListingComponent';
import PageLoader from './loading';

export async function generateMetadata(): Promise<Metadata> {
  const type = (await cookies()).get('t')?.value as ListType;

  return {
    title: `Movie Box | ${type.charAt(0).toLocaleUpperCase() + type.slice(1)}`,
    description: `Movie listing`,
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; category: string }> }) => {
  let { page, category } = (await searchParams) as {
    page: string;
    category: keyof typeof MovieCategoryEnum;
  };

  if (!page) page = '1';
  if (!category) category = 'top_rated';

  return (
    <Suspense key={JSON.stringify({ page, category, l: 8 })} fallback={<PageLoader />}>
      <ListingComponent category={category} page={page} />
    </Suspense>
  );
};

export default Page;
