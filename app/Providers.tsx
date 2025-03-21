'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { MainCtxProvider } from './_context/Main';
import { FavoriteCtxProvider } from './_context/Favorite';
import { movie } from '@prisma/client';

const Providers = ({ children, fav }: { children: React.ReactNode; fav: movie[] | null }) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    posthog.init('phc_5kSPgKI5giV3go66S4elKO8oGXfb5G0Yrf2mK3Sc9Uu', {
      api_host: '/ingest',
      ui_host: 'https://us.i.posthog.com',
      capture_pageview: false,
      person_profiles: 'identified_only',
    });
  }

  return (
    <PostHogProvider client={posthog}>
      <MainCtxProvider>
        <FavoriteCtxProvider fav={fav}>{children}</FavoriteCtxProvider>
      </MainCtxProvider>
    </PostHogProvider>
  );
};

export default Providers;
