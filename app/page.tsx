import ErrorPageComponent from '@/components/helpers/Error';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  let redirectPath: string | null = null;

  try {
    const c = await cookies();
    const t = c.get('t')?.value;

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
