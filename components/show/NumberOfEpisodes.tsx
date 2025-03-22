import { Tv2 } from 'lucide-react';
import React from 'react';

const NumberOfEpisodes = ({ isCard, number_of_episodes }: { isCard?: boolean; number_of_episodes: number }) => {
  return (
    <div className={`flex items-center gap-2 text-sm ${isCard ? 'scale-75' : 'scale-100'}`}>
      <Tv2 size={15} />
      <span>{number_of_episodes} Episodes</span>
    </div>
  );
};

export default NumberOfEpisodes;
