import { feature_flags, filter, movie, WebhookConfig } from '@prisma/client';
import { MovieCategory } from './movies';
import { ShowCategory } from './show';
import { User } from 'better-auth';

export interface WebhookHeader {
  key: string;
  value: string;
}

export type ProviderProps = {
  user?: User;
  fav: movie[] | null;
  filters: filter[] | null;
  featureFlags: feature_flags[] | null;
  webhookConfig: WebhookConfig[] | null;
  isSuperAdmin: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FetchDataArgs<T> {
  url?: string;
  args?: RequestInit;
  message?: string;
}

export type ListType = 'movie' | 'tv';

export interface FilterOption {
  page?: string;
  category?: MovieCategory | ShowCategory;
  'vote_count.gte'?: string;
  'vote_average.gte'?: string;
  sort_by?: string;
  year?: string;
  per?: number;
  include_adult?: string;
  with_release_type?: string;
  'release_date.gte'?: string;
  'release_date.lte'?: string;
  'primary_release_date.gte'?: string;
  'primary_release_date.lte'?: string;
  'air_date.gte'?: string;
  'air_date.lte'?: string;
  'first_air_date.gte'?: string;
  'first_air_date.lte'?: string;
  with_original_language?: string;
  with_origin_country?: string;
  without_genres?: string;
  with_genres?: string;
}

export interface UsePrevNextButtonsType {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
}

export interface Credit {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Review {
  author: string;
  author_details: AuthorDetail;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface AuthorDetail {
  name: string;
  username: string;
  avatar_path: string;
  rating: number | null;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path?: string;
  name: string;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Logo {
  aspect_ratio: number;
  height: number;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface Poster {
  aspect_ratio: number;
  height: number;
  iso_639_1?: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface DownlodResult {
  name: string;
  size: string;
  seeders: string;
  leechers: string;
  category: string;
  uploader: string;
  url: string;
  date: string;
  hash: string;
  magnet: string;
}

export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface LastEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

export interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface Episode {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface SeasonDetail {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}
