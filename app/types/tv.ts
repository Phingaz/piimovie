export interface TvApiResponse {
  page: number;
  results: Tv[];
  total_pages: number;
  total_results: number;
  dates: { maximum: string; minumum: string };
}

export interface TvDownloadApiResponse {
  data: TvDownlodResult[];
  total: number;
}

export interface TvReviewsApiResponse {
  page: number;
  results: TvRating[];
  total_pages: number;
  total_results: number;
  dates: { maximum: string; minumum: string };
}

export interface VideoApiResponse {
  results: {
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
  }[];
  id: number;
}

export interface TvImagesApiResponse {
  backdrops: Logo[];
}

export interface TvKeywordApiResponse {
  id: number;
  keywords: TvKeyword[];
}

export interface TvCreditApiResponse {
  id: number;
  cast: TvCredit[];
}

export type TvType = 'airing_today' | 'on_the_air' | 'popular' | 'top_rated';

export enum TvTypeEnum {
  airing_today = 'Airing Today',
  popular = 'Popular',
  on_the_air = 'On The Air',
  top_rated = 'Top Rated',
}

export interface Tv {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TvImagesResponse {
  backdrops: Backdrop[];
  id: number;
  logos: Logo[];
  posters: Poster[];
}

export interface Backdrop {
  aspect_ratio: number;
  height: number;
  iso_639_1?: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
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

export type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export interface TvDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: unknown;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: unknown;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: { name: string }[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type TvCredit = {
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
};

export interface TvRating {
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

export interface TvKeyword {
  id: number;
  name: string;
}

export interface TvDownlodResult {
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
