import { UseQueryResult, useQuery } from "@tanstack/react-query";
import React, { createContext } from "react";

import {
  getMovieDetailRq,
  getMovieImagesRq,
  getMovieRecommendationsRq,
  getMovieSimilarRq,
  getMoviesRq,
  getVideoRq,
} from "@/lib/qry";
import { MovieImagesResponse, MovieResponse, VideoResponse } from "../types";
import { usePathname, useSearchParams } from "next/navigation";

export type TQueriesCtx = {
  getLandingMovies: UseQueryResult<MovieResponse, Error>;
  popularMovies: UseQueryResult<MovieResponse, Error>;
  topRatedMovies: UseQueryResult<MovieResponse, Error>;
  upcomingMovies: UseQueryResult<MovieResponse, Error>;
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
  //movie detail
  movie: {} as UseQueryResult<any, Error>,
  movieImg: {} as UseQueryResult<MovieImagesResponse, Error>,
  video: {} as UseQueryResult<VideoResponse, Error>,
  recommendations: {} as UseQueryResult<MovieResponse, Error>,
  similar: {} as UseQueryResult<MovieResponse, Error>,
});

export function QueriesCtxProvider({ children }: React.PropsWithChildren<{}>) {
  const page = useSearchParams().get("page");
  const movieId = usePathname().split("/")[2];

  const getLandingMovies = useQuery({
    queryKey: ["getLandingMovies"],
    queryFn: () => getMoviesRq("now_playing", Number(page) || 1),
  });

  const popularMovies = useQuery({
    queryKey: ["popularMovies"],
    queryFn: () => getMoviesRq("popular", 1),
  });

  const topRatedMovies = useQuery({
    queryKey: ["topRatedMovies"],
    queryFn: () => getMoviesRq("top_rated", 1),
  });

  const upcomingMovies = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: () => getMoviesRq("upcoming", 1),
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
