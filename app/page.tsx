import ErrorPageComponent from '@/components/helpers/Error';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const c = await cookies();
    const t = c.get('t')?.value;

    return {
      title: `Pii Movie | ${t ? t.charAt(0).toLocaleUpperCase() + t.slice(1) : 'Movie'}`,
      description:
        'Discover, search, and download your favorite movies with ease. Our app lets you find the latest releases, timeless classics, and hidden gems—all in one place. With powerful search, seamless torrenting, and a personalized favorites list, your movie collection is just a tap away.',
    };
  } catch {
    return {
      title: 'Pii Movie | Error Fetching Langing Page',
      description: 'Something went wrong while fetching the movie details.',
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
