import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import Providers from './Providers';
import Header from '@/components/nav/Header';
import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getFavorites } from './queries/favorites';
import { movie } from '@prisma/client';
import Footer from '@/components/general/Footer';

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

export const metadata: Metadata = {
  title: 'Movie Box | Home',
  description:
    'Discover, search, and download your favorite movies with ease. Our app lets you find the latest releases, timeless classics, and hidden gems—all in one place. With powerful search, seamless torrenting, and a personalized favorites list, your movie collection is just a tap away.',
};

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

  if (session && session.user) {
    fav = await getFavorites(session.user);
  }

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
      </head>
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        <Providers value={{ user, fav }}>
          <Header />
          <main className="relative -mt-[80px]">{children}</main>
          <Footer />
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
