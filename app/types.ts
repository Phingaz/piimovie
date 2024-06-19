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

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: any;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: any[];
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

export interface VideoResponse {
  id: number;
  results: Result[];
}

export interface Result {
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

export interface Genre {
  id: number;
  name: string;
}