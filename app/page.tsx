import ErrorPageComponent from '@/components/helpers/Error';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const c = await cookies();
    const t = c.get('t')?.value;

    const typeTitle = t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Movies & TV Shows';
    const title = `Discover ${typeTitle}`;
    const description = `Discover and explore the best ${typeTitle.toLowerCase()}. Find detailed information, cast, crew, reviews, ratings, and more. Browse popular titles, new releases, and timeless classics all in one place.`;

    return {
      title,
      description,
      keywords: [
        'movies',
        'tv shows',
        'cinema',
        'entertainment',
        'database',
        'search',
        'discover',
        'popular movies',
        'top rated',
        'new releases',
        'cast',
        'crew',
        'reviews',
      ],
      openGraph: {
        title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch {
    return {
      title: 'Discover Movies & TV Shows',
      description:
        'Your ultimate destination for discovering movies and TV shows with detailed information, cast, crew, and reviews.',
      robots: 'noindex, follow',
    };
  }
}

export default async function Home() {
  let redirectPath: string | null = null;

  try {
    const c = await cookies();
    const t = c.get('t')?.value;

    if (t === 'movie') {
      redirectPath = '/movie';
    } else if (t === 'tv') {
      redirectPath = '/tv';
    } else {
      redirectPath = '/movie';
    }
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  } finally {
    redirect(redirectPath as string);
  }
}
