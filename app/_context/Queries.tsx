import { UseQueryResult, useQuery } from "@tanstack/react-query";
import React, { createContext } from "react";

import {
  downloadMovieRq,
  getMovieDetailRq,
  getMovieImagesRq,
  getMovieRecommendationsRq,
  getMovieSimilarRq,
  getMoviesRq,
  getVideoRq,
  searchMovieRq,
} from "@/lib/qry.client";
import { MovieImagesResponse, MovieResponse, VideoResponse } from "../types";
import useCustomParams from "../_hooks/useCustomParams";

export type TQueriesCtx = {
  getLandingMovies: UseQueryResult<MovieResponse, Error>;
  popularMovies: UseQueryResult<MovieResponse, Error>;
  topRatedMovies: UseQueryResult<MovieResponse, Error>;
  upcomingMovies: UseQueryResult<MovieResponse, Error>;
  collection: UseQueryResult<MovieResponse, Error>;
  searchMovies: UseQueryResult<MovieResponse, Error>;
  torrent: UseQueryResult<any, Error>;
  //movie detail
  movie: UseQueryResult<any, Error>;
  movieImg: UseQueryResult<MovieImagesResponse, Error>;
  video: UseQueryResult<VideoResponse, Error>;
  recommendations: UseQueryResult<MovieResponse, Error>;
  similar: UseQueryResult<MovieResponse, Error>;
};

const Queries = createContext<TQueriesCtx>({
  getLandingMovies: {} as UseQueryResult<MovieResponse, Error>,
  popularMovies: {} as UseQueryResult<MovieResponse, Error>,
  topRatedMovies: {} as UseQueryResult<MovieResponse, Error>,
  upcomingMovies: {} as UseQueryResult<MovieResponse, Error>,
  collection: {} as UseQueryResult<MovieResponse, Error>,
  searchMovies: {} as UseQueryResult<MovieResponse, Error>,
  torrent: {} as UseQueryResult<any, Error>,
  //movie detail
  movie: {} as UseQueryResult<any, Error>,
  movieImg: {} as UseQueryResult<MovieImagesResponse, Error>,
  video: {} as UseQueryResult<VideoResponse, Error>,
  recommendations: {} as UseQueryResult<MovieResponse, Error>,
  similar: {} as UseQueryResult<MovieResponse, Error>,
});

export function QueriesCtxProvider({ children }: React.PropsWithChildren<{}>) {
  const { page, path, list, movieId, search, site, limit } = useCustomParams();

  const getLandingMovies = useQuery({
    queryKey: ["getLandingMovies"],
    queryFn: () => getMoviesRq("now_playing", Number(page)),
    enabled: path === "/",
  });

  const popularMovies = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => getMoviesRq("popular", Number(page)),
    enabled: path === "/",
  });

  const topRatedMovies = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => getMoviesRq("top_rated", Number(page)),
    enabled: path === "/",
  });

  const upcomingMovies = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: () => getMoviesRq("upcoming", Number(page)),
    enabled: path === "/",
  });

  const collection = useQuery({
    queryKey: ["collection", list, page],
    queryFn: () => getMoviesRq(list, Number(page)),
    enabled: path === "/moviecollection",
  });

  const searchMovies = useQuery({
    queryKey: ["searchMovies", search, page],
    queryFn: () => searchMovieRq(search, Number(page) || 1),
    enabled: !!search,
  });

  const torrent = useQuery({
    queryKey: ["torrent", search, page, site, limit],
    queryFn: () => downloadMovieRq(search, site, Number(limit), Number(page)),
    enabled: !!search && path === "/download",
  });

  //movie detail
  const movie = useQuery({
    queryKey: ["movieDetail", movieId],
    queryFn: () => getMovieDetailRq(movieId),
    enabled: !!movieId,
  });

  const movieImg = useQuery({
    queryKey: ["movieImages", movieId],
    queryFn: () => getMovieImagesRq(Number(movieId)),
    enabled: !!movieId,
  });

  const video = useQuery({
    queryKey: ["video", movieId],
    queryFn: () => getVideoRq(Number(movieId)),
    enabled: !!movieId,
  });

  const recommendations = useQuery({
    queryKey: ["recommendations", movieId],
    queryFn: () => getMovieRecommendationsRq(Number(movieId)),
    enabled: !!movieId,
  });

  const similar = useQuery({
    queryKey: ["similar", movieId],
    queryFn: () => getMovieSimilarRq(Number(movieId)),
    enabled: !!movieId,
  });

  const contextValue = {
    getLandingMovies,
    popularMovies,
    topRatedMovies,
    upcomingMovies,
    collection,
    searchMovies,
    torrent,
    //movie detail
    movie,
    movieImg,
    video,
    recommendations,
    similar,
  };

  return <Queries.Provider value={contextValue}>{children}</Queries.Provider>;
}

export default Queries;
