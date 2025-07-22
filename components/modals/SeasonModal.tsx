'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import ModalComponent from '../general/Modal';
import { Season, Episode, SeasonDetail } from '@/app/_types/utils';
import { imageCardUrl, formatDate } from '@/lib/utils';
import ImageComponent from '../utils/ImageComponent';
import { Calendar, Clock, Play, Star, Tv2, Loader2 } from 'lucide-react';
import { ErrorMovieSection } from '../helpers/Error';

import NumberOfEpisodes from '../show/NumberOfEpisodes';
import Ratings from '../utils/texts/Ratings';
import ReleaseDate from '../utils/texts/ReleaseDate';
import NumberOfSeasons from '../show/NumberOfSeasons';
import { getSeasonDetails } from '@/app/_queries/queries';
import Link from 'next/link';

interface SeasonModalProps {
  season: Season;
  tvId: number;
  showName: string;
}

const SeasonModal = ({ season, tvId, showName }: SeasonModalProps) => {
  const [open, setOpen] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpenModal = async () => {
    if (episodes.length === 0 && !loading) {
      setLoading(true);
      setError(null);

      try {
        const response = await getSeasonDetails({ tvId, seasonNumber: season.season_number });
        setEpisodes(response.data?.episodes || []);
        setSeasonDetails(response.data);
      } catch (err) {
        setError('An error occurred while fetching episodes');
        console.error('Error fetching season details:', err);
      } finally {
        setLoading(false);
      }
    }
    setOpen(true);
  };

  return (
    <ModalComponent
      open={open}
      setOpen={setOpen}
      className="w-[min(1000px,90vw)] sm:max-w-[1000px]"
      title={`${showName}`}
      description={`Episodes from ${season.name}`}
      trigger={
        <Button
          onClick={handleOpenModal}
          className="w-full h-full p-0 rounded-lg m-0 relative overflow-hidden group"
          variant="ghost"
        >
          <div className="from-65% bg-gradient-to-b to-black absolute top-0 left-0 w-full h-full flex items-end z-[2] group-hover:from-50%">
            <div className="p-1 flex flex-wrap justify-evenly">
              <NumberOfSeasons custom={season.name} isCard number_of_seasons={season.season_number} />
              <NumberOfEpisodes isCard number_of_episodes={season.episode_count} />
              <Ratings vote_average={season.vote_average} isReview />
              <ReleaseDate isCard release_date={season.air_date} />
            </div>
          </div>
          <ImageComponent string={imageCardUrl(season.poster_path)} title={season.name} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-[1]" />
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-4 mb-6">
          <div className="flex-shrink-0">
            <ImageComponent
              string={imageCardUrl(seasonDetails?.poster_path || season.poster_path)}
              title={season.name}
              className="w-36 h-50 rounded-sm object-cover"
            />
          </div>
          <div className="flex-1 p-3">
            <h3 className="text-xl font-bold mb-2">{season.name}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {seasonDetails?.overview || season.overview || 'No overview available.'}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(season.air_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tv2 size={14} />
                <span>{season.episode_count} Episodes</span>
              </div>

              <div className="flex items-center gap-1">
                <Star size={14} fill="yellow" className="text-amber-400" />
                <span>{season.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold mb-3">Episodes</h4>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span>Loading episodes...</span>
            </div>
          )}

          {error && <ErrorMovieSection error={error} title="Episodes" />}

          {episodes.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} showName={showName} />
              ))}
            </div>
          )}

          {!loading && !error && episodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Tv2 size={48} className="mx-auto mb-2 opacity-50" />
              <p>No episodes available for this season.</p>
            </div>
          )}
        </div>
      </div>
    </ModalComponent>
  );
};

const EpisodeCard = ({ showName, episode }: { showName: string; episode: Episode }) => {
  const episodeNumber = episode.episode_number.toString().padStart(2, '0');
  const seasonNumber = episode.season_number.toString().padStart(2, '0');

  return (
    <Link
      href={`/download?q=${showName} S${seasonNumber}E${episodeNumber}`}
      className="flex gap-3 p-3 bg-gray-900 rounded-sm hover:bg-gray-700 transition-colors"
    >
      <div className="flex-shrink-0">
        {episode.still_path ? (
          <ImageComponent
            string={imageCardUrl(episode.still_path)}
            title={episode.name}
            className="w-24 h-full rounded object-cover"
          />
        ) : (
          <div className="w-24 h-14 bg-gray-800 rounded flex items-center justify-center">
            <Play size={16} className="text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <h5 className="font-medium text-sm leading-tight">
            {episode.episode_number}. {episode.name}
          </h5>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 ml-2">
            <Star size={12} fill="yellow" className="text-amber-400" />
            <span>{episode.vote_average.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {episode.overview || 'No description available.'}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
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

export default SeasonModal;
