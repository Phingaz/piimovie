'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { MainCtxProvider } from './_context/Main';
// import GlobalLoader from '@/components/helpers/GlobalLoader';

const Providers = ({ children }: { children: React.ReactNode }) => {
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
        {/* <GlobalLoader /> */}
        {children}
      </MainCtxProvider>
    </PostHogProvider>
  );
};

export default Providers;
