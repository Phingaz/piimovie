import ErrorPageComponent from '@/components/helpers/Error';
import Hero from '@/components/landing/Hero';
import LadingListingWrapper from '@/components/landing/LadingListingWrapper';
import { getMovies } from '@/lib/queries';
import { getRandomNumber, getRandomType } from '@/lib/utils';

export default async function Home() {
  try {
    const result = await getMovies({
      page: getRandomNumber(10),
      type: getRandomType(),
    });
    
    if (!result.success) throw new Error(result.message);

    const movies = result.data?.results;

    return (
      <main className="relative -mt-[80px]">
        <Hero movies={movies} />
        <LadingListingWrapper />
      </main>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
}
