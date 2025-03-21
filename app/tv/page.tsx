import { connection } from 'next/server';
import ErrorPageComponent from '@/components/helpers/Error';
import LadingListingWrapper from '@/components/landing/LadingListingWrapper';
import { getRandomNumber, getRandomShowCategory } from '@/lib/utils';
import { getListing } from '../queries/queries';
import HeroMovieImg from '@/components/landing/HeroMovieImage';
import HeroMovieInfo from '@/components/landing/HeroMovieInfo';

const type = 'tv';

export default async function Home() {
  try {
    await connection();
    const result = await getListing({ page: getRandomNumber(10), category: getRandomShowCategory(), type });

    if (!result.success) throw new Error(result.message);

    const movies = result.data?.results;

    return (
      <section>
        <div className="relative">
          <HeroMovieImg items={movies} />
          <HeroMovieInfo type={type} items={movies} />
        </div>
        <LadingListingWrapper type={type} />
      </section>
    );
  } catch (error) {
    return <ErrorPageComponent error={error} />;
  }
}
