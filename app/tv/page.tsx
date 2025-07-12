import { PageLoader } from '@/components/helpers/Loaders';
import TvComponent from '@/components/show/TvComponent';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

const type = 'tv';

export function generateMetadata(): Metadata {
  const title = 'TV Shows';
  const description =
    'Explore the best TV shows and series. Discover popular series, trending shows, top-rated programs, and classic television. Find detailed information about episodes, seasons, cast, crew, and reviews for every show.';

  return {
    title,
    description,
    keywords: [
      'tv shows',
      'television series',
      'streaming',
      'episodes',
      'seasons',
      'popular shows',
      'top rated series',
      'tv database',
      'show reviews',
      'drama series',
      'comedy shows',
      'documentaries',
      'miniseries',
    ],
    openGraph: {
      title: `${title} | Pii Movie`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Pii Movie`,
      description,
    },
    alternates: {
      canonical: '/tv',
    },
  };
}

const Page = async ({ params }: { params: Promise<{ movie: string }> }) => {
  const id = (await params).movie;
  return (
    <Suspense key={id} fallback={<PageLoader />}>
      <TvComponent type={type} />
    </Suspense>
  );
};

export default Page;
