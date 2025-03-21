import { connection } from 'next/server';
import ErrorPageComponent from '@/components/helpers/Error';
import Hero from '@/components/landing/Hero';
import LadingListingWrapper from '@/components/landing/LadingListingWrapper';
import { getMovies } from '@/app/queries/queries';
import { getRandomNumber, getRandomType } from '@/lib/utils';

export default async function Home() {
  try {
    await connection();

    const result = await getMovies({
      page: getRandomNumber(10),
      type: getRandomType(),
    });

    if (!result.success) throw new Error(result.message);

    const movies = result.data?.results;

    return (
      <>
        <Hero movies={movies} />
        <LadingListingWrapper />
      </>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
}
