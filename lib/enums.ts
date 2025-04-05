import { MovieCategory } from '@/app/types/movies';
import { ShowCategory } from '@/app/types/show';
import { ListType } from '@/app/types/utils';

export const SortOptionsEnum = (type: ListType) => ({
  popularity: 'popularity.desc',
  release_date: type === 'movie' ? 'release_date.desc' : 'first_air_date.desc',
  vote_average: 'vote_average.desc',
  vote_count: 'vote_count.desc',
});

export enum MovieCategoryEnum {
  now_playing = 'Now Playing',
  popular = 'Popular',
  top_rated = 'Top Rated',
  upcoming = 'Upcoming',
}

export enum ShowCategoryEnum {
  airing_today = 'Airing Today',
  popular = 'Popular',
  on_the_air = 'On The Air',
  top_rated = 'Top Rated',
}

export const Queries = (category: MovieCategory | ShowCategory, type: ListType) => {
  const date = new Date();
  const year = date.getFullYear();

  const today = date.toISOString().split('T')[0];
  const yearBeginning = `${year}-01-01`;
  const yearEnd = `${year}-12-31`;
  const SortOptions = SortOptionsEnum(type);

  return {
    now_playing: `category=${category}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=${SortOptions.popularity}&with_release_type=2%7C3&release_date_gte=${yearBeginning}&release_date_lte=${today}&vote_count=1&vote_average=1`,
    popular: `category=${category}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=${SortOptions.popularity}`,
    upcoming: `category=${category}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=${SortOptions.popularity}&with_release_type=2%7C3&release_date_gte=${yearBeginning}&release_date_lte=${today}`,
    top_rated: `category=${category}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=${SortOptions.vote_average}&vote_count=1000`,
    on_the_air: `category=${category}&include_adult=false&language=en-US&page=1&sort_by=${SortOptions.release_date}&air_date_lte=${yearEnd}&air_date_gte=${yearBeginning}&without_genres=10767%7C10763%7C99%7C10764&&vote_count=1&vote_average=1`,
    airing_today: `category=${category}&include_adult=false&language=en-US&page=1&sort_by=${SortOptions.release_date}&air_date_lte=${today}&air_date_gte=${yearBeginning}&with_origin_country=US&vote_count=1&vote_average=1`,
  };
};
