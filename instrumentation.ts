import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: 'https://e7cce0fad18b49869acb98185b8629b9@o4507255804461056.ingest.us.sentry.io/4508412595011584',
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      tracesSampleRate: 1,
      debug: false,
      enabled: process.env.NODE_ENV === 'production',
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: 'https://e7cce0fad18b49869acb98185b8629b9@o4507255804461056.ingest.us.sentry.io/4508412595011584',
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      tracesSampleRate: 1,
      debug: false,
      enabled: process.env.NODE_ENV === 'production',
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
