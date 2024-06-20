import { Movie } from "@/app/types";
import { Heart } from "lucide-react";
import React from "react";

const Favorite = ({
  movieDetail,
  manageFav,
  isFavourite,
}: {
  movieDetail: Movie;
  manageFav: (movie: Movie) => void;
  isFavourite: boolean;
}) => {
  return (
    <Heart
      onClick={() => manageFav(movieDetail as unknown as Movie)}
      fill={isFavourite ? "red" : "#0000"}
      className={`${
        isFavourite ? "text-red-500" : ""
      } cursor-pointer transition min-w-[30px] min-h-[25px]`}
    />
  );
};

export default Favorite;
