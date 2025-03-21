import ErrorPageComponent from '@/components/helpers/Error';
import { redirect } from 'next/navigation';

export default async function Home({ searchParams }: { searchParams: Promise<{ t: string }> }) {
  let redirectPath: string | null = null;

  try {
    const { t } = await searchParams;

    if (t === 'movie') {
      redirectPath = '/movie';
    } else if (t === 'show') {
      redirectPath = '/show';
    } else {
      redirectPath = '/movie';
    }
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  } finally {
    redirect(redirectPath as string);
  }
}
