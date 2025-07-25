'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import ModalComponent from '../general/Modal';
import { Season, Episode, SeasonDetail } from '@/app/_types/utils';
import { imageCardUrl, formatDate } from '@/lib/utils';
import ImageComponent from '../utils/ImageComponent';
import { Calendar, Tv2, Loader2, Star } from 'lucide-react';
import { ErrorMovieSection } from '../helpers/Error';

import NumberOfEpisodes from '../show/NumberOfEpisodes';
import Ratings from '../utils/texts/Ratings';
import ReleaseDate from '../utils/texts/ReleaseDate';
import NumberOfSeasons from '../show/NumberOfSeasons';
import { getSeasonDetails } from '@/app/_queries/queries';

import EpisodeCard from '../show/EpisodeCard';
import { useRouter, useSearchParams } from 'next/navigation';

interface SeasonModalProps {
  season: Season;
  tvId: number;
  showName: string;
}

const SeasonModal = ({ season, tvId, showName }: SeasonModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const seasonParam = searchParams.get('s');
  const isCurrentSeasonOpen = seasonParam === String(season.season_number);

  const openModal = React.useCallback(() => {
    const newParams = new URLSearchParams(Array.from(searchParams.entries()));
    newParams.set('s', season.season_number.toString());
    router.push(`?${newParams.toString()}`, { scroll: false });
  }, [searchParams, season.season_number, router]);

  const closeModal = React.useCallback(() => {
    const newParams = new URLSearchParams(Array.from(searchParams.entries()));
    newParams.delete('s');
    router.push(`?${newParams.toString()}`, { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (isCurrentSeasonOpen && episodes.length === 0 && !loading) {
      setLoading(true);
      setError(null);
      getSeasonDetails({ tvId, seasonNumber: season.season_number })
        .then((response) => {
          setEpisodes(response.data?.episodes || []);
          setSeasonDetails(response.data);
        })
        .catch((err) => {
          setError('An error occurred while fetching episodes');
          console.error('Error fetching season details:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [isCurrentSeasonOpen, episodes.length, loading, tvId, season.season_number]);

  return (
    <ModalComponent
      open={isCurrentSeasonOpen}
      setOpen={(state) => (state ? openModal() : closeModal())}
      className="w-[min(1000px,90vw)] max-h-[90svh] sm:max-w-[1000px]"
      title={`${showName}`}
      description={`Episodes from ${season.name}`}
      trigger={
        <Button
          variant="ghost"
          onClick={openModal}
          className="w-full h-full p-0 rounded-lg m-0 relative overflow-hidden group"
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
      <div className="space-y-2 md:space-y-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-3 md:mb-6">
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
            <div className="flex flex-wrap gap-2 md:gap-4 text-sm">
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
        <div className="space-y-2 sticky top-0">
          <h4 className="text-lg font-semibold mb-3">Episodes</h4>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span>Loading episodes...</span>
            </div>
          )}

          {error && <ErrorMovieSection error={error} title="Episodes" />}

          {episodes.length > 0 && (
            <div className="space-y-3 max-h-[40svh] overflow-y-auto pr-1 md:pr-2 tiny-scrollbar">
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

export default SeasonModal;
