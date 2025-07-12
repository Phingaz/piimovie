import React from 'react';
import { Metadata } from 'next';
import { ListType, FilterOption } from '../_types/utils';
import { cookies } from 'next/headers';
import ListingComponent from './ListingComponent';
import { ErrorBoundary } from '@/components/helpers/ErrorBoundary';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}): Promise<Metadata> {
  const type = (await cookies()).get('t')?.value as ListType;
  const { category } = await searchParams;

  const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);
  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ') : '';

  const title = `${typeTitle} Listing${categoryTitle ? ` - ${categoryTitle}` : ''}`;
  const description = category
    ? `Browse ${categoryTitle.toLowerCase()} ${type}s. Discover ${type}s in the ${categoryTitle.toLowerCase()} category with detailed information, ratings, and reviews.`
    : `Browse and discover ${type}s. Find detailed information, ratings, cast, crew, and reviews for every ${type}.`;

  return {
    title,
    description,
    keywords: [
      typeTitle.toLowerCase(),
      ...(category ? [category.replace('_', ' ')] : []),
      'browse',
      'listing',
      'discover',
      'database',
      'catalog',
    ],
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
    alternates: {
      canonical: `/listing${category ? `?category=${category}` : ''}`,
    },
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; category: string }> }) => {
  const data = (await searchParams) as FilterOption;
  const type = (await cookies()).get('t')?.value as ListType;

  if (!data.page) data.page = '1';

  return (
    <ErrorBoundary>
      <ListingComponent data={data} type={type} />
    </ErrorBoundary>
  );
};

export default Page;
