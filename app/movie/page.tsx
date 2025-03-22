import { PageLoader } from '@/components/helpers/Loaders';
import LandingComponent from '@/components/landing/LandingComponent';
import { Suspense } from 'react';

const type = 'movie';

export default function Home() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LandingComponent type={type} />
    </Suspense>
  );
}
