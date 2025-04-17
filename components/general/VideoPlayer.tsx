import React from 'react';
import { MovieDetailError } from '../helpers/Error';
import { getVideos } from '@/app/_queries/queries';
import { ListType } from '@/app/_types/utils';

export const VideoPlayer = async ({ id, type }: { id: number; type: ListType }) => {
  try {
    const response = await getVideos({ id, type });

    if (!response.success || !response.data) throw new Error(response.message);
    const results = response.data.results;

    return (
      <div
        className={`aspect-video w-full rounded-md border-dashed border-gray-500/50 border ${type === 'movie' ? 'h-auto' : 'h-full'}`}
      >
        <iframe
          width="100%"
          height="100%"
          allowFullScreen
          className="rounded-md"
          title={results[0]?.name}
          src={`https://www.youtube.com/embed/${results[0]?.key}?autoplay=1&mute=1`}
        ></iframe>
      </div>
    );
  } catch (error) {
    return <MovieDetailError error={error} />;
  }
};
