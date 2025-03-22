import { getDetails } from '@/app/queries/queries';
import { PageLoader } from '@/components/helpers/Loaders';
import TvComponent from '@/components/show/TvComponent';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

const type = 'tv';

export async function generateMetadata({ params }: { params: Promise<{ movie: string }> }): Promise<Metadata> {
  try {
    const id = (await params).movie;
    const response = await getDetails({ id, type });

    if (!response.data) throw new Error(response.message);

    return {
      title: `${response.data.original_name} | Movie Info`,
      description: response.data.overview || 'Find out more about this movie.',
    };
  } catch {
    return {
      title: 'Error | Movie Not Found',
      description: 'Something went wrong while fetching the movie details.',
    };
  }
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
