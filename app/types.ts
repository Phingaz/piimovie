// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FetchDataArgs<T> {
  url?: string;
  args?: RequestInit;
  message?: string;
}

export interface MovieApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
  dates: { maximum: string; minumum: string };
}

export interface MovieDownloadApiResponse {
  data: MovieDownlodResult[];
  total: number;
}

export interface MovieReviewsApiResponse {
  page: number;
  results: MovieRating[];
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

export interface MovieImagesApiResponse {
  backdrops: Logo[];
}

export interface MovieKeywordApiResponse {
  id: number;
  keywords: MovieKeyword[];
}

export interface MovieCreditApiResponse {
  id: number;
  cast: MovieCredit[];
}

export type MovieType = "now_playing" | "popular" | "top_rated" | "upcoming";

export enum MovieTypeEnum {
  now_playing = "Now Playing",
  popular = "Popular",
  top_rated = "Top Rated",
  upcoming = "Upcoming",
}

export interface Movie {
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

export interface MovieImagesResponse {
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

export interface MovieDetail {
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

export type MovieCredit = {
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

export interface MovieRating {
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

export interface MovieKeyword {
  id: number;
  name: string;
}

export interface MovieDownlodResult {
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
