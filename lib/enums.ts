import { MovieCategory } from '@/app/_types/movies';
import { ShowCategory } from '@/app/_types/show';
import { ListType } from '@/app/_types/utils';
import { formatISO } from 'date-fns';

export const SortOptionsEnum = (type: ListType) => ({
  popularity: 'popularity.desc',
  release_date: type === 'movie' ? 'primary_release_date.asc' : 'first_air_date.asc',
  release_date_desc: type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc',
  vote_average: 'vote_average.desc',
  vote_count: 'vote_count.desc',
});

export enum FilterEnum {
  VC_GTE = 'vote_count.gte',
  VC_LTE = 'vote_count.lte',
  VA_GTE = 'vote_average.gte',
  VA_LTE = 'vote_average.lte',
  SORT_BY = 'sort_by',
  INCLUDE_ADULT = 'include_adult',
  WITH_RELEASE_TYPE = 'with_release_type',
  RELEASE_DATE_GTE = 'release_date.gte',
  RELEASE_DATE_LTE = 'release_date.lte',
  PRIMARY_RELEASE_DATE_GTE = 'primary_release_date.gte',
  PRIMARY_RELEASE_DATE_LTE = 'primary_release_date.lte',
  AIR_DATE_GTE = 'air_date.gte',
  AIR_DATE_LTE = 'air_date.lte',
  FIRST_AIR_DATE_GTE = 'first_air_date.gte',
  FIRST_AIR_DATE_LTE = 'first_air_date.lte',
  WITH_ORIGIN_COUNTRY = 'with_origin_country',
  WITH_ORIGINAL_LANGUAGE = 'with_original_language',
  WITHOUT_GENRES = 'without_genres',
  PAGE = 'page',
  CATEGORY = 'category',
  YEAR = 'year',
  WITH_GENRES = 'with_genres',
}

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
  const SortOptions = SortOptionsEnum(type);

  const now = new Date();
  const today = formatISO(now, { representation: 'date' });
  const yearStart = formatISO(new Date(now.getFullYear(), 0, 1), { representation: 'date' });
  const yearEnd = formatISO(new Date(now.getFullYear(), 11, 31), { representation: 'date' });
  const lastYearStart = formatISO(new Date(now.getFullYear() - 1, 0, 1), { representation: 'date' });

  return {
    now_playing: {
      [FilterEnum.CATEGORY]: category,
      [FilterEnum.SORT_BY]: SortOptions.release_date_desc,
      [FilterEnum.VC_GTE]: '20',
      [FilterEnum.VA_GTE]: '3',
      [FilterEnum.WITH_RELEASE_TYPE]: '1|2|3',
    },
    popular: {
      [FilterEnum.CATEGORY]: category,
      [FilterEnum.SORT_BY]: SortOptions.popularity,
      [FilterEnum.VC_GTE]: '500',
      [FilterEnum.VA_GTE]: '6',
      [FilterEnum.WITHOUT_GENRES]: '10767|10764|10762|10402|35',
      [FilterEnum.WITH_ORIGIN_COUNTRY]: 'US',
    },
    upcoming: {
      [FilterEnum.CATEGORY]: category,
      [FilterEnum.PRIMARY_RELEASE_DATE_GTE]: today,
      [FilterEnum.PRIMARY_RELEASE_DATE_LTE]: yearEnd,
      [FilterEnum.SORT_BY]: SortOptions.release_date,
      [FilterEnum.WITH_RELEASE_TYPE]: '2|3',
      [FilterEnum.WITH_ORIGIN_COUNTRY]: 'US',
      [FilterEnum.WITH_GENRES]: '28',
    },
    top_rated: {
      [FilterEnum.CATEGORY]: category,
      [FilterEnum.SORT_BY]: SortOptions.vote_average,
      [FilterEnum.RELEASE_DATE_GTE]: yearStart,
      [FilterEnum.RELEASE_DATE_LTE]: today,
      [FilterEnum.VC_GTE]: '10000',
      vote_average: '8',
    },
    on_the_air: {
      [FilterEnum.CATEGORY]: category,
      [FilterEnum.SORT_BY]: SortOptions.popularity,
      [FilterEnum.FIRST_AIR_DATE_GTE]: lastYearStart,
      [FilterEnum.FIRST_AIR_DATE_LTE]: yearEnd,
      [FilterEnum.WITH_ORIGIN_COUNTRY]: 'US',
      [FilterEnum.VC_GTE]: '20',
      [FilterEnum.VA_GTE]: '5',
    },
    airing_today: {
      [FilterEnum.CATEGORY]: category,
      [FilterEnum.SORT_BY]: SortOptions.release_date_desc,
      [FilterEnum.FIRST_AIR_DATE_GTE]: yearStart,
      [FilterEnum.FIRST_AIR_DATE_LTE]: today,
      [FilterEnum.VC_GTE]: '1',
      [FilterEnum.VA_GTE]: '1',
      [FilterEnum.WITH_ORIGIN_COUNTRY]: 'US',
      [FilterEnum.WITHOUT_GENRES]: '10767|10764|10762|10402',
      [FilterEnum.WITH_GENRES]: '10765|10759|10768|18|9648',
    },
  };
};
