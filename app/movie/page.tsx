import { PageLoader } from '@/components/helpers/Loaders';
import LandingComponent from '@/components/landing/LandingComponent';
import { Metadata } from 'next';
import { Suspense } from 'react';

const type = 'movie';

export function generateMetadata(): Metadata {
  return {
    title: `Pii Movie | ${type.charAt(0).toLocaleUpperCase() + type.slice(1)}`,
    description:
      'Discover, search, and download your favorite movies with ease. Our app lets you find the latest releases, timeless classics, and hidden gems—all in one place. With powerful search, seamless torrenting, and a personalized favorites list, your movie collection is just a tap away.',
  };
}

export default function Home() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LandingComponent type={type} />
    </Suspense>
  );
}
