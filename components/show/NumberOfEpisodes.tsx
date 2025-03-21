import { Tv2 } from 'lucide-react';
import React from 'react';

const NumberOfEpisodes = ({ isCard, number_of_episodes }: { isCard?: boolean; number_of_episodes: number }) => {
  return (
    <div className={`flex items-center gap-2 ${isCard ? 'scale-75' : 'scale-100'}`}>
      <Tv2 className="h-5 w-5" />
      <span>{number_of_episodes} Episodes</span>
    </div>
  );
};

export default NumberOfEpisodes;
