import { SelectOption } from '@/components/utils/Select';

export const links = [
  {
    label: 'Movies',
    href: '/movies?list=now_playing',
  },
  {
    label: 'Tv Shows',
    href: '/tv-shows',
  },
];

export const movieGenreId = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

export const FavOptions: SelectOption[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Tv Shows',
    value: 'tv',
  },
  {
    label: 'Movies',
    value: 'movie',
  },
];

export const MovieCategoryOptions: SelectOption[] = [
  {
    label: 'Now Playing',
    value: 'now_playing',
  },
  {
    label: 'Popular',
    value: 'popular',
  },
  {
    label: 'Top Rated',
    value: 'top_rated',
  },
  {
    label: 'Upcoming',
    value: 'upcoming',
  },
];

export const TvCategoryOptions: SelectOption[] = [
  {
    label: 'On The Air',
    value: 'on_the_air',
  },
  {
    label: 'Popular',
    value: 'popular',
  },
  {
    label: 'Top Rated',
    value: 'top_rated',
  },
  {
    label: 'Airing Today',
    value: 'airing_today',
  },
];
