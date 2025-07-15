import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import Providers from './Providers';
import Header from '@/components/nav/Header';
import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getFavorites, getFeatureFlags, getFilters } from './_queries/dbProps';
import { feature_flags, filter, movie } from '@prisma/client';
import Footer from '@/components/general/Footer';
// import db from '@/lib/prisma';
import ENV from '@/lib/env';
import { WebsiteStructuredData } from '@/components/seo/StructuredData';
import { ErrorBoundary } from '@/components/helpers/ErrorBoundary';

const heading = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-heading',
});

const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700', '800'],
  variable: '--font-body',
});

export async function generateMetadata(): Promise<Metadata> {
  // const allowBot = await db.feature_flags.findFirst({
  //   where: { name: 'allowBots' },
  // });

  const title = 'Pii Movie - Discover Movies & TV Shows';
  const description =
    'Discover, search, and download your favorite movies and TV shows with ease. Find the latest releases, timeless classics, and hidden gems—all in one place. With powerful search, personalized favorites, and detailed information for every title.';
  const url = ENV.NEXT_PUBLIC_URL;

  return {
    title: {
      default: title,
      template: '%s | Pii Movie',
    },
    description,
    keywords: [
      'movies',
      'tv shows',
      'cinema',
      'entertainment',
      'streaming',
      'movie database',
      'film reviews',
      'cast',
      'crew',
      'trailers',
      'movie search',
      'tv series',
      'episodes',
      'seasons',
      'IMDb alternative',
    ],
    authors: [{ name: 'Pii Movie' }],
    creator: 'Pii Movie',
    publisher: 'Pii Movie',
    // robots: allowBot?.enabled ? 'index, follow' : 'noindex',
    robots: 'index, follow',
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: url,
      title: title,
      description: description,
      siteName: 'Pii Movie',
      images: [
        {
          url: `${url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Pii Movie - Your Ultimate Movie Database',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`${url}/og-image.png`],
      creator: '@piimovie',
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/site.webmanifest',
    verification: {
      google: ENV.GOOGLE_VERIFICATION_CODE,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  let fav: movie[] | null = null;
  let filters: filter[] | null = null;
  let featureFlags: feature_flags[] | null = null;

  if (session && session.user) {
    fav = await getFavorites(session.user);
    filters = await getFilters(session.user);
    featureFlags = await getFeatureFlags();
  }

  const isSuperAdmin = (ENV.SUPER_ADMINS || '').split(',').includes(user?.email || '');

  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        <WebsiteStructuredData />
        <ErrorBoundary>
          <Providers value={{ user, fav, filters, featureFlags, isSuperAdmin }}>
            <Header />
            <main className="relative -mt-[80px] min-h-[calc(100svh-200px)]">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
            <Footer />
          </Providers>
        </ErrorBoundary>
        <Toaster richColors />
      </body>
    </html>
  );
}
