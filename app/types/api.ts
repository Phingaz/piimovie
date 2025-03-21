import { Credit, DownlodResult, Keyword, Logo, Review, Video } from './utils';

export interface ListApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
  dates: { maximum: string; minumum: string };
}

export interface DownloadApiResponse {
  data: DownlodResult[];
  total: number;
}

export interface ReviewsApiResponse {
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
  dates: { maximum: string; minumum: string };
}

export interface VideoApiResponse {
  results: Video[];
  id: number;
}

export interface ImagesApiResponse {
  backdrops: Logo[];
}

export interface KeywordApiResponse {
  id: number;
  keywords: Keyword[];
}

export interface CreditApiResponse {
  id: number;
  cast: Credit[];
}
