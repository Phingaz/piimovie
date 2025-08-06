import { Suspense } from 'react';
import StreamingComponent from '@/components/streaming/StreamingComponent';
import { Metadata } from 'next';
import { PageLoader } from '@/components/helpers/Loaders';

export const metadata: Metadata = {
  title: 'Video Streaming | PiiMovie',
  description: 'Stream videos directly from magnet links using our advanced streaming platform.',
};

export default function StreamingPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <StreamingComponent />
    </Suspense>
  );
}
