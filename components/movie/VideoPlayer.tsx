import React from 'react';
import { MovieDetailError } from '../helpers/Error';
import { getVideos } from '@/app/queries/queries';

export const VideoPlayer = async ({ id }: { id: number }) => {
  try {
    const response = await getVideos({ id });

    if (!response.success || !response.data) throw new Error(response.message);
    const results = response.data.results;

    return (
      <div className="aspect-video w-full border-gray-500/50 border-2">
        <iframe
          width="100%"
          height="100%"
          allowFullScreen
          title={results[0]?.name}
          src={`https://www.youtube.com/embed/${results[0]?.key}?autoplay=1&mute=1`}
        ></iframe>
      </div>
    );
  } catch (error) {
    return <MovieDetailError error={error} />;
  }
};
