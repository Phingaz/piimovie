import React from 'react';
import { Metadata } from 'next';
import { ListType, SortOption } from '../types/utils';
import { cookies } from 'next/headers';
import ListingComponent from './ListingComponent';

export async function generateMetadata(): Promise<Metadata> {
  const type = (await cookies()).get('t')?.value as ListType;

  return {
    title: `Movie Box | ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} Listing`,
    description: `${type.charAt(0).toLocaleUpperCase() + type.slice(1)} listing`,
  };
}

const Page = async ({ searchParams }: { searchParams: Promise<{ page: string; category: string }> }) => {
  const data = (await searchParams) as SortOption;
  const type = (await cookies()).get('t')?.value as ListType;

  if (!data.page) data.page = '1';

  return <ListingComponent data={data} type={type} />;
};

export default Page;
