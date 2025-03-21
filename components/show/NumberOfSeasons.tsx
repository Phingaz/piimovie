import { Film } from 'lucide-react';
import React from 'react';

const NumberOfSeasons = ({
  isCard = false,
  custom,
  number_of_seasons,
}: {
  custom?: string;
  isCard?: boolean;
  number_of_seasons: number;
}) => {
  return (
    <div className={`flex items-center justify-start gap-2 ${isCard ? 'scale-75' : 'scale-100'}`}>
      <Film className="h-5 w-5" />
      <span>{custom ? custom :`${number_of_seasons} Seasons`}</span>
    </div>
  );
};

export default NumberOfSeasons;
