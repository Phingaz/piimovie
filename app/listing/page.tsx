import React from 'react';
import { Metadata } from 'next';
import { ListType, FilterOption } from '../types/utils';
import { cookies } from 'next/headers';
import ListingComponent from './ListingComponent';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}): Promise<Metadata> {
  const type = (await cookies()).get('t')?.value as ListType;
  const c = (await searchParams).category;

  return {
    title: `${type.charAt(0).toLocaleUpperCase() + type.slice(1)} Listing ${c ? `| ${c.charAt(0).toLocaleUpperCase() + c.slice(1).replace('_', ' ')}` : ''}`,
    description: `${type.charAt(0).toLocaleUpperCase() + type.slice(1)} listing`,
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; category: string }> }) => {
  const data = (await searchParams) as FilterOption;
  const type = (await cookies()).get('t')?.value as ListType;

  if (!data.page) data.page = '1';

  return <ListingComponent data={data} type={type} />;
};

export default Page;
