import { ListType } from '@/app/types/utils';
import { SelectOption } from '@/components/utils/Select';

export const links = [
  { label: 'Movies', href: '/movies?list=now_playing' },
  { label: 'Tv Shows', href: '/tv-shows' },
];

export const movieGenres: SelectOption[] = [
  { value: (28).toString(), label: 'Action' },
  { value: (12).toString(), label: 'Adventure' },
  { value: (16).toString(), label: 'Animation' },
  { value: (35).toString(), label: 'Comedy' },
  { value: (80).toString(), label: 'Crime' },
  { value: (99).toString(), label: 'Documentary' },
  { value: (18).toString(), label: 'Drama' },
  { value: (10751).toString(), label: 'Family' },
  { value: (14).toString(), label: 'Fantasy' },
  { value: (36).toString(), label: 'History' },
  { value: (27).toString(), label: 'Horror' },
  { value: (10402).toString(), label: 'Music' },
  { value: (9648).toString(), label: 'Mystery' },
  { value: (10749).toString(), label: 'Romance' },
  { value: (878).toString(), label: 'Science Fiction' },
  { value: (10770).toString(), label: 'TV Movie' },
  { value: (53).toString(), label: 'Thriller' },
  { value: (10752).toString(), label: 'War' },
  { value: (37).toString(), label: 'Western' },
];

export const tvGenres: SelectOption[] = [
  { value: (10759).toString(), label: 'Action & Adventure' },
  { value: (16).toString(), label: 'Animation' },
  { value: (35).toString(), label: 'Comedy' },
  { value: (80).toString(), label: 'Crime' },
  { value: (99).toString(), label: 'Documentary' },
  { value: (18).toString(), label: 'Drama' },
  { value: (10751).toString(), label: 'Family' },
  { value: (10762).toString(), label: 'Kids' },
  { value: (10763).toString(), label: 'News' },
  { value: (9648).toString(), label: 'Mystery' },
  { value: (10764).toString(), label: 'Reality' },
  { value: (10765).toString(), label: 'Sci-Fi & Fantasy' },
  { value: (10766).toString(), label: 'Soap' },
  { value: (10767).toString(), label: 'Talk' },
  { value: (10768).toString(), label: 'War & Politics' },
  { value: (37).toString(), label: 'Western' },
];

export const releaseType: SelectOption[] = [
  { value: (1).toString(), label: 'Premiere' },
  { value: (2).toString(), label: 'Theatrical (limited)' },
  { value: (3).toString(), label: 'Theatrical' },
  { value: (4).toString(), label: 'Digital' },
  { value: (5).toString(), label: 'Physical' },
  { value: (6).toString(), label: 'TV' },
];

export const sortOptions = (t: ListType): SelectOption[] => {
  const isMovie = t === 'movie';

  return [
    { label: 'Vote Count ↓', value: 'vote_count.desc' },
    { label: 'Vote Count ↑', value: 'vote_count.asc' },
    { label: 'Vote Average ↓', value: 'vote_average.desc' },
    { label: 'Vote Average ↑', value: 'vote_average.asc' },
    { label: 'Popularity ↓', value: 'popularity.desc' },
    { label: 'Popularity ↑', value: 'popularity.asc' },
    {
      label: isMovie ? 'Release Date ↓' : 'Release Date ↓',
      value: isMovie ? 'primary_release_date.desc' : 'first_air_date.desc',
    },
    {
      label: isMovie ? 'Release Date ↑' : 'Release Date ↑',
      value: isMovie ? 'primary_release_date.asc' : 'first_air_date.asc',
    },
  ];
};

export const FavOptions: SelectOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Tv Shows', value: 'tv' },
  { label: 'Movies', value: 'movie' },
];

export const MovieCategoryOptions: SelectOption[] = [
  { label: 'Now Playing', value: 'now_playing' },
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Upcoming', value: 'upcoming' },
];

export const movieCat = [
  { title: 'Popular', href: '/listing?category=popular' },
  { title: 'Top Rated', href: '/listing?category=top_rated' },
  { title: 'Upcoming', href: '/listing?category=upcoming' },
  { title: 'Now Playing', href: '/listing?category=on_the_air' },
];

export const tvShowsCat = [
  { title: 'Popular', href: '/listing?category=popular' },
  { title: 'Top Rated', href: '/listing?category=top_rated' },
  { title: 'On The Air', href: '/listing?category=now_playing' },
  { title: 'Airing Today', href: '/listing?category=airing_today' },
];

export const TvCategoryOptions: SelectOption[] = [
  { label: 'On The Air', value: 'on_the_air' },
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Airing Today', value: 'airing_today' },
];

export const countries: SelectOption[] = [
  {
    value: 'AD',
    label: 'Andorra',
  },
  {
    value: 'AE',
    label: 'United Arab Emirates',
  },
  {
    value: 'AG',
    label: 'Antigua and Barbuda',
  },
  {
    value: 'AL',
    label: 'Albania',
  },
  {
    value: 'AR',
    label: 'Argentina',
  },
  {
    value: 'AT',
    label: 'Austria',
  },
  {
    value: 'AU',
    label: 'Australia',
  },
  {
    value: 'BA',
    label: 'Bosnia and Herzegovina',
  },
  {
    value: 'BB',
    label: 'Barbados',
  },
  {
    value: 'BE',
    label: 'Belgium',
  },
  {
    value: 'BG',
    label: 'Bulgaria',
  },
  {
    value: 'BH',
    label: 'Bahrain',
  },
  {
    value: 'BM',
    label: 'Bermuda',
  },
  {
    value: 'BO',
    label: 'Bolivia',
  },
  {
    value: 'BR',
    label: 'Brazil',
  },
  {
    value: 'BS',
    label: 'Bahamas',
  },
  {
    value: 'CA',
    label: 'Canada',
  },
  {
    value: 'CH',
    label: 'Switzerland',
  },
  {
    value: 'CI',
    label: "Cote D'Ivoire",
  },
  {
    value: 'CL',
    label: 'Chile',
  },
  {
    value: 'CO',
    label: 'Colombia',
  },
  {
    value: 'CR',
    label: 'Costa Rica',
  },
  {
    value: 'CU',
    label: 'Cuba',
  },
  {
    value: 'CV',
    label: 'Cape Verde',
  },
  {
    value: 'CZ',
    label: 'Czech Republic',
  },
  {
    value: 'DE',
    label: 'Germany',
  },
  {
    value: 'DK',
    label: 'Denmark',
  },
  {
    value: 'DO',
    label: 'Dominican Republic',
  },
  {
    value: 'DZ',
    label: 'Algeria',
  },
  {
    value: 'EC',
    label: 'Ecuador',
  },
  {
    value: 'EE',
    label: 'Estonia',
  },
  {
    value: 'EG',
    label: 'Egypt',
  },
  {
    value: 'ES',
    label: 'Spain',
  },
  {
    value: 'FI',
    label: 'Finland',
  },
  {
    value: 'FJ',
    label: 'Fiji',
  },
  {
    value: 'FR',
    label: 'France',
  },
  {
    value: 'GB',
    label: 'United Kingdom',
  },
  {
    value: 'GF',
    label: 'French Guiana',
  },
  {
    value: 'GH',
    label: 'Ghana',
  },
  {
    value: 'GI',
    label: 'Gibraltar',
  },
  {
    value: 'GP',
    label: 'Guadaloupe',
  },
  {
    value: 'GQ',
    label: 'Equatorial Guinea',
  },
  {
    value: 'GR',
    label: 'Greece',
  },
  {
    value: 'GT',
    label: 'Guatemala',
  },
  {
    value: 'HK',
    label: 'Hong Kong',
  },
  {
    value: 'HN',
    label: 'Honduras',
  },
  {
    value: 'HR',
    label: 'Croatia',
  },
  {
    value: 'HU',
    label: 'Hungary',
  },
  {
    value: 'ID',
    label: 'Indonesia',
  },
  {
    value: 'IE',
    label: 'Ireland',
  },
  {
    value: 'IL',
    label: 'Israel',
  },
  {
    value: 'IN',
    label: 'India',
  },
  {
    value: 'IQ',
    label: 'Iraq',
  },
  {
    value: 'IS',
    label: 'Iceland',
  },
  {
    value: 'IT',
    label: 'Italy',
  },
  {
    value: 'JM',
    label: 'Jamaica',
  },
  {
    value: 'JO',
    label: 'Jordan',
  },
  {
    value: 'JP',
    label: 'Japan',
  },
  {
    value: 'KE',
    label: 'Kenya',
  },
  {
    value: 'KR',
    label: 'South Korea',
  },
  {
    value: 'KW',
    label: 'Kuwait',
  },
  {
    value: 'LB',
    label: 'Lebanon',
  },
  {
    value: 'LC',
    label: 'St. Lucia',
  },
  {
    value: 'LI',
    label: 'Liechtenstein',
  },
  {
    value: 'LT',
    label: 'Lithuania',
  },
  {
    value: 'LV',
    label: 'Latvia',
  },
  {
    value: 'LY',
    label: 'Libyan Arab Jamahiriya',
  },
  {
    value: 'MA',
    label: 'Morocco',
  },
  {
    value: 'MC',
    label: 'Monaco',
  },
  {
    value: 'MD',
    label: 'Moldova',
  },
  {
    value: 'MK',
    label: 'Macedonia',
  },
  {
    value: 'MT',
    label: 'Malta',
  },
  {
    value: 'MU',
    label: 'Mauritius',
  },
  {
    value: 'MX',
    label: 'Mexico',
  },
  {
    value: 'MY',
    label: 'Malaysia',
  },
  {
    value: 'MZ',
    label: 'Mozambique',
  },
  {
    value: 'NE',
    label: 'Niger',
  },
  {
    value: 'NG',
    label: 'Nigeria',
  },
  {
    value: 'NL',
    label: 'Netherlands',
  },
  {
    value: 'NO',
    label: 'Norway',
  },
  {
    value: 'NZ',
    label: 'New Zealand',
  },
  {
    value: 'OM',
    label: 'Oman',
  },
  {
    value: 'PA',
    label: 'Panama',
  },
  {
    value: 'PE',
    label: 'Peru',
  },
  {
    value: 'PF',
    label: 'French Polynesia',
  },
  {
    value: 'PH',
    label: 'Philippines',
  },
  {
    value: 'PK',
    label: 'Pakistan',
  },
  {
    value: 'PL',
    label: 'Poland',
  },
  {
    value: 'PS',
    label: 'Palestinian Territory',
  },
  {
    value: 'PT',
    label: 'Portugal',
  },
  {
    value: 'PY',
    label: 'Paraguay',
  },
  {
    value: 'QA',
    label: 'Qatar',
  },
  {
    value: 'RO',
    label: 'Romania',
  },
  {
    value: 'RS',
    label: 'Serbia',
  },
  {
    value: 'RU',
    label: 'Russia',
  },
  {
    value: 'SA',
    label: 'Saudi Arabia',
  },
  {
    value: 'SC',
    label: 'Seychelles',
  },
  {
    value: 'SE',
    label: 'Sweden',
  },
  {
    value: 'SG',
    label: 'Singapore',
  },
  {
    value: 'SI',
    label: 'Slovenia',
  },
  {
    value: 'SK',
    label: 'Slovakia',
  },
  {
    value: 'SM',
    label: 'San Marino',
  },
  {
    value: 'SN',
    label: 'Senegal',
  },
  {
    value: 'SV',
    label: 'El Salvador',
  },
  {
    value: 'TC',
    label: 'Turks and Caicos Islands',
  },
  {
    value: 'TH',
    label: 'Thailand',
  },
  {
    value: 'TN',
    label: 'Tunisia',
  },
  {
    value: 'TR',
    label: 'Turkey',
  },
  {
    value: 'TT',
    label: 'Trinidad and Tobago',
  },
  {
    value: 'TW',
    label: 'Taiwan',
  },
  {
    value: 'TZ',
    label: 'Tanzania',
  },
  {
    value: 'UG',
    label: 'Uganda',
  },
  {
    value: 'US',
    label: 'United States of America',
  },
  {
    value: 'UY',
    label: 'Uruguay',
  },
  {
    value: 'VA',
    label: 'Holy See',
  },
  {
    value: 'VE',
    label: 'Venezuela',
  },
  {
    value: 'XK',
    label: 'Kosovo',
  },
  {
    value: 'YE',
    label: 'Yemen',
  },
  {
    value: 'ZA',
    label: 'South Africa',
  },
  {
    value: 'ZM',
    label: 'Zambia',
  },
];
