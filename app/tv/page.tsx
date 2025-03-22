import { PageLoader } from '@/components/helpers/Loaders';
import TvComponent from '@/components/show/TvComponent';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

const type = 'tv';

export function generateMetadata(): Metadata {
  return {
    title: `Pii Movie | ${type.charAt(0).toLocaleUpperCase() + type.slice(1)}`,
    description:
      'Discover, search, and download your favorite movies with ease. Our app lets you find the latest releases, timeless classics, and hidden gems—all in one place. With powerful search, seamless torrenting, and a personalized favorites list, your movie collection is just a tap away.',
  };
}

const Page = async ({ params }: { params: Promise<{ movie: string }> }) => {
  const id = (await params).movie;
  return (
    <Suspense key={id} fallback={<PageLoader />}>
      <TvComponent type={type} />;
    </Suspense>
  );
};

export default Page;
