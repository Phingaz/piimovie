import { Star } from 'lucide-react';
import React from 'react';

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
    <span className={`flex flex-wrap gap-1 items-center p-1 ${showBg ? 'bg-black/70 px-2 rounded-sm' : ''}`}>
      {vote_average >= 1 && <Star fill="yellow" size={isReview ? 12 : 20} className="text-amber-400" />}
      <p className={`${isReview ? 'text-[12px]' : 'text-sm'}`}>
        {vote_average >= 1 ? `${vote_average?.toFixed()}/10` : `Not Rated`}
      </p>
      {voteCount !== null && voteCount !== undefined && voteCount >= 1 && (
        <p className={`${isReview ? 'text-[12px]' : 'text-sm'}`}>({voteCount}) votes</p>
      )}
    </span>
  );
};

export default Ratings;