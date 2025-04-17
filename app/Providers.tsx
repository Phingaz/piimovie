'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { MainCtxProvider } from './_context/Main';
import { DbPropsCtxProvider } from './_context/DbProps';
import { ProviderProps } from './_types/utils';

const Providers = ({ children, value }: { children: React.ReactNode; value: ProviderProps }) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    posthog.init('phc_5kSPgKI5giV3go66S4elKO8oGXfb5G0Yrf2mK3Sc9Uu', {
      api_host: '/ingest',
      ui_host: 'https://us.i.posthog.com',
      capture_pageview: false,
      person_profiles: 'identified_only',
    });

    if (value.user) {
      posthog.identify(value.user.id, value.user);
    }
  }

  return (
    <PostHogProvider client={posthog}>
      <MainCtxProvider user={value.user}>
        <DbPropsCtxProvider value={value}>{children}</DbPropsCtxProvider>
      </MainCtxProvider>
    </PostHogProvider>
  );
};

export default Providers;
