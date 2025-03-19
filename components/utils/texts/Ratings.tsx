import { Star } from "lucide-react";
import React from "react";

const Ratings = ({
  showBg,
  isReview,
  voteCount,
  vote_average,
}: {
  showBg?: boolean;
  isReview?: boolean;
  voteCount?: number | null;
  vote_average: number;
}) => {
  return (
    <span
      className={`flex gap-1 items-center p-1 ${
        showBg ? "bg-black/70 px-2 rounded-md" : ""
      }`}
    >
      <Star fill="yellow" size={isReview ? 15 : 20} className="text-amber-400" />
      <p className={`${isReview ? "text-[12px]" : "text-sm"}`}>
        {vote_average.toFixed()}/10
      </p>
      {voteCount && <p className="text-sm">({voteCount}) votes</p>}
    </span>
  );
};

export default Ratings;
