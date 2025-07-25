import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Play, Star } from 'lucide-react';
import { imageCardUrl, formatDate } from '@/lib/utils';
import ImageComponent from '../utils/ImageComponent';
import { Episode } from '@/app/_types/utils';

interface EpisodeCardProps {
  showName: string;
  episode: Episode;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ showName, episode }) => {
  const episodeNumber = episode.episode_number.toString().padStart(2, '0');
  const seasonNumber = episode.season_number.toString().padStart(2, '0');

  return (
    <Link
      href={`/download?q=${showName} S${seasonNumber}E${episodeNumber}`}
      className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-900 rounded-sm hover:bg-gray-700 transition-colors"
    >
      <div className="flex-shrink-0 w-full sm:w-24 h-32 sm:h-auto overflow-clip rounded">
        {episode.still_path ? (
          <ImageComponent
            string={imageCardUrl(episode.still_path)}
            title={episode.name}
            className="w-full h-32 sm:w-24 sm:h-full rounded object-cover"
          />
        ) : (
          <div className="w-full h-14 sm:w-24 bg-gray-800 rounded flex items-center justify-center">
            <Play size={16} className="text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1 gap-1">
          <h5 className="font-medium text-sm leading-tight">
            {episode.episode_number}. {episode.name}
          </h5>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 sm:ml-2">
            <Star size={12} fill="yellow" className="text-amber-400" />
            <span>{episode.vote_average.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {episode.overview || 'No description available.'}
        </p>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
          {episode.air_date && (
            <div className="flex items-center gap-1">
              <Calendar size={10} />
              <span>{formatDate(episode.air_date)}</span>
            </div>
          )}
          {episode.runtime && (
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>{episode.runtime}m</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EpisodeCard;
