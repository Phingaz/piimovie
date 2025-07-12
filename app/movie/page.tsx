import { PageLoader } from '@/components/helpers/Loaders';
import LandingComponent from '@/components/landing/LandingComponent';
import { Metadata } from 'next';
import { Suspense } from 'react';

const type = 'movie';

export function generateMetadata(): Metadata {
  const title = 'Movies';
  const description =
    'Discover the latest and greatest movies. Browse popular films, new releases, top-rated movies, and timeless classics. Find detailed information, cast, crew, reviews, and trailers for every movie.';

  return {
    title,
    description,
    keywords: [
      'movies',
      'films',
      'cinema',
      'new releases',
      'popular movies',
      'top rated movies',
      'movie database',
      'film reviews',
      'movie trailers',
      'box office',
      'hollywood',
      'independent films',
      'classic movies',
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
      canonical: '/movie',
    },
  };
}

export default function Home() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LandingComponent type={type} />
    </Suspense>
  );
}
