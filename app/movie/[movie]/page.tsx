import { getDetails } from '@/app/_queries/queries';
import { PageLoader } from '@/components/helpers/Loaders';
import MovieComponent from '@/components/movie/MovieComponent';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

const type = 'movie';

export async function generateMetadata({ params }: { params: Promise<{ movie: string }> }): Promise<Metadata> {
  try {
    const id = (await params).movie;
    const response = await getDetails({ id, type });

    if (!response.data) throw new Error(response.message);

    const movie = response.data;
    const title = `${movie.title}`;
    const description =
      movie.overview || `Watch ${movie.title}. Learn about cast, crew, ratings, and more details about this movie.`;
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
    const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : '';
    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '';

    return {
      title: `${title}${releaseYear ? ` (${releaseYear})` : ''}`,
      description,
      keywords: [
        movie.title,
        ...(movie.genres?.map((g) => g.name) || []),
        'movie',
        'film',
        'cinema',
        'watch',
        'stream',
        ...(movie.production_companies?.map((c) => c.name) || []),
      ],
      openGraph: {
        type: 'video.movie',
        title: title,
        description: description,
        images: [
          {
            url: backdropUrl || imageUrl,
            width: 1280,
            height: 720,
            alt: `${movie.title} poster`,
          },
          ...(imageUrl
            ? [
                {
                  url: imageUrl,
                  width: 780,
                  height: 1170,
                  alt: `${movie.title} poster`,
                },
              ]
            : []),
        ],
        releaseDate: movie.release_date,
        ...(movie.runtime && { duration: movie.runtime * 60 }), // Convert minutes to seconds
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [backdropUrl || imageUrl],
      },
      alternates: {
        canonical: `/movie/${id}`,
      },
    };
  } catch {
    return {
      title: 'Movie Not Found',
      description: 'Sorry, we could not find the movie you are looking for.',
      robots: 'noindex',
    };
  }
}

const Page = async ({ params }: { params: Promise<{ movie: string }> }) => {
  const id = (await params).movie;

  return (
    <Suspense key={id} fallback={<PageLoader />}>
      <MovieComponent type={type} id={id} />
    </Suspense>
  );
};

export default Page;
