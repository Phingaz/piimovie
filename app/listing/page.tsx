import React, { Suspense } from 'react';
import { MovieCategoryEnum } from '../types/movies';
import { Metadata } from 'next';
import { ListType } from '../types/utils';
import { cookies } from 'next/headers';
import ListingComponent from './ListingComponent';
import PageLoader from './loading';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  const type = (await cookies()).get('t')?.value as ListType;
  const title = MovieCategoryEnum[category as keyof typeof MovieCategoryEnum];

  return {
    title: `Movie Box | ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} | ${title}`,
    description: `Movie listing for ${title}`,
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; category: string }> }) => {
  const { page, category } = (await searchParams) as {
    page: string;
    category: keyof typeof MovieCategoryEnum;
  };

  return (
    <Suspense key={JSON.stringify({ page, category, l: 8 })} fallback={<PageLoader />}>
      <ListingComponent category={category} page={page} />;
    </Suspense>
  );
};

export default Page;
