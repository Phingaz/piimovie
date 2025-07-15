import { getDetails } from '@/app/_queries/queries';
import { PageLoader } from '@/components/helpers/Loaders';
import ShowComponent from '@/components/show/ShowComponent';
import { ErrorBoundary } from '@/components/helpers/ErrorBoundary';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

const type = 'tv';

export async function generateMetadata({ params }: { params: Promise<{ tv: string }> }): Promise<Metadata> {
  try {
    const id = (await params).tv;
    const response = await getDetails({ id, type });

    if (!response.data) {
      notFound();
    }

    const show = response.data;
    const title = `${show.name}`;
    const description =
      show.overview ||
      `Watch ${show.name}. Learn about cast, crew, episodes, seasons, and more details about this TV show.`;
    const firstAirYear = show.first_air_date ? new Date(show.first_air_date).getFullYear() : '';
    const imageUrl = show.poster_path ? `https://image.tmdb.org/t/p/w780${show.poster_path}` : '';
    const backdropUrl = show.backdrop_path ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}` : '';

    return {
      title: `${title}${firstAirYear ? ` (${firstAirYear})` : ''}`,
      description,
      keywords: [
        show.name,
        ...(show.genres?.map((g) => g.name) || []),
        'tv show',
        'television',
        'series',
        'episodes',
        'seasons',
        'watch',
        'stream',
        ...(show.networks?.map((n) => n.name) || []),
        ...(show.production_companies?.map((c) => c.name) || []),
      ],
      openGraph: {
        type: 'video.tv_show',
        title: title,
        description: description,
        images: [
          {
            url: backdropUrl || imageUrl,
            width: 1280,
            height: 720,
            alt: `${show.name} poster`,
          },
          ...(imageUrl
            ? [
                {
                  url: imageUrl,
                  width: 780,
                  height: 1170,
                  alt: `${show.name} poster`,
                },
              ]
            : []),
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [backdropUrl || imageUrl],
      },
      alternates: {
        canonical: `/tv/${id}`,
      },
    };
  } catch {
    notFound();
  }
}

const Page = async ({ params }: { params: Promise<{ tv: string }> }) => {
  const id = (await params).tv;

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <ShowComponent type={type} id={id} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Page;
