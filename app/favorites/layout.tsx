import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movie Box | Favorite',
  description: 'Your favorite movie list',
};

import React from 'react';

const layout = ({ children }: { children: React.ReactElement }) => {
  return <>{children}</>;
};

export default layout;
