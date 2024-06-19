import React from "react";
import MovieDetailInfo from "../../utils/MovieDetailInfo";
import { formatCurrency, runTimeInHourAndMin } from "@/lib/utils";
import { MovieDetail } from "@/app/types";

const Infos = ({ movieDetail }: { movieDetail: MovieDetail }) => {
  const companies = movieDetail.production_companies
    .map((el) => el.name)
    .join(", ");
  const countries = movieDetail.production_countries
    .map((el) => el.name)
    .join(", ");
  const languages = movieDetail.spoken_languages
    .map((el) => el.name)
    .join(", ");

  return (
    <div className="flex flex-col gap-1">
      <MovieDetailInfo title="Status" info={movieDetail?.status} />
      <MovieDetailInfo title="Release date" info={movieDetail?.release_date} />
      <MovieDetailInfo
        title="Runtime"
        info={runTimeInHourAndMin(movieDetail.runtime)}
      />
      <MovieDetailInfo title="Languages" info={languages} />
      <MovieDetailInfo title="Countries" info={countries} />
      <MovieDetailInfo title="Companies" info={companies} />
      <MovieDetailInfo
        title="Budget"
        info={formatCurrency(movieDetail?.budget)}
      />
      <MovieDetailInfo
        title="Revenue"
        info={formatCurrency(movieDetail?.revenue)}
      />
    </div>
  );
};

export default Infos;
