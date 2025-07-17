import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movie Box | Favorite',
  description: 'Your favorite movie list',
};

import React from 'react';
import { syncUserMovieRatings } from '../_queries/queries';

const layout = ({ children }: { children: React.ReactElement }) => {
  syncUserMovieRatings({ maxAge: 24, batchSize: 10 });
  return <>{children}</>;
};

export default layout;
