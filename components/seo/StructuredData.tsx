'use client';

import Script from 'next/script';

interface MovieStructuredDataProps {
  movie: {
    id: number;
    title: string;
    overview?: string;
    release_date?: string;
    poster_path?: string;
    backdrop_path?: string;
    vote_average?: number;
    vote_count?: number;
    runtime?: number;
    genres?: Array<{ id: number; name: string }>;
    production_companies?: Array<{ id?: number; name: string }>;
    production_countries?: Array<{ iso_3166_1: string; name: string }>;
    spoken_languages?: Array<{ iso_639_1: string; name: string }>;
  };
  credits?: {
    cast?: Array<{
      id: number;
      name: string;
      character: string;
      profile_path?: string;
    }>;
    crew?: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
}

interface TVShowStructuredDataProps {
  show: {
    id: number;
    name: string;
    overview?: string;
    first_air_date?: string;
    last_air_date?: string;
    poster_path?: string;
    backdrop_path?: string;
    vote_average?: number;
    vote_count?: number;
    number_of_episodes?: number;
    number_of_seasons?: number;
    genres?: Array<{ id: number; name: string }>;
    production_companies?: Array<{ id?: number; name: string }>;
    production_countries?: Array<{ iso_3166_1: string; name: string }>;
    spoken_languages?: Array<{ iso_639_1: string; name: string }>;
    networks?: Array<{ id?: number; name: string }>;
  };
  credits?: {
    cast?: Array<{
      id: number;
      name: string;
      character: string;
      profile_path?: string;
    }>;
    crew?: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
}

export function MovieStructuredData({ movie, credits }: MovieStructuredDataProps) {
  const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : '';

  const director = credits?.crew?.find((person) => person.job === 'Director');
  const actors = credits?.cast?.slice(0, 5).map((actor) => ({
    '@type': 'Person',
    name: actor.name,
    url: `https://www.google.com/search?q=${encodeURIComponent(actor.name)}`,
  }));

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.overview,
    image: imageUrl,
    ...(movie.release_date && { datePublished: movie.release_date }),
    ...(movie.runtime && { duration: `PT${movie.runtime}M` }),
    ...(movie.vote_average && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: movie.vote_average,
        ratingCount: movie.vote_count,
        bestRating: 10,
        worstRating: 0,
      },
    }),
    ...(director && {
      director: {
        '@type': 'Person',
        name: director.name,
      },
    }),
    ...(actors && actors.length > 0 && { actor: actors }),
    ...(movie.genres && {
      genre: movie.genres.map((genre) => genre.name),
    }),
    ...(movie.production_companies &&
      movie.production_companies.length > 0 && {
        productionCompany: movie.production_companies.map((company) => ({
          '@type': 'Organization',
          name: company.name,
        })),
      }),
  };

  return (
    <Script
      id="movie-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export function TVShowStructuredData({ show, credits }: TVShowStructuredDataProps) {
  const imageUrl = show.poster_path ? `https://image.tmdb.org/t/p/w780${show.poster_path}` : '';

  const creator = credits?.crew?.find((person) => person.job === 'Creator' || person.job === 'Executive Producer');
  const actors = credits?.cast?.slice(0, 5).map((actor) => ({
    '@type': 'Person',
    name: actor.name,
    url: `https://www.google.com/search?q=${encodeURIComponent(actor.name)}`,
  }));

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: show.name,
    description: show.overview,
    image: imageUrl,
    ...(show.first_air_date && { startDate: show.first_air_date }),
    ...(show.last_air_date && { endDate: show.last_air_date }),
    ...(show.number_of_episodes && { numberOfEpisodes: show.number_of_episodes }),
    ...(show.number_of_seasons && { numberOfSeasons: show.number_of_seasons }),
    ...(show.vote_average && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: show.vote_average,
        ratingCount: show.vote_count,
        bestRating: 10,
        worstRating: 0,
      },
    }),
    ...(creator && {
      creator: {
        '@type': 'Person',
        name: creator.name,
      },
    }),
    ...(actors && actors.length > 0 && { actor: actors }),
    ...(show.genres && {
      genre: show.genres.map((genre) => genre.name),
    }),
    ...(show.production_companies &&
      show.production_companies.length > 0 && {
        productionCompany: show.production_companies.map((company) => ({
          '@type': 'Organization',
          name: company.name,
        })),
      }),
    ...(show.networks &&
      show.networks.length > 0 && {
        network: show.networks.map((network) => ({
          '@type': 'Organization',
          name: network.name,
        })),
      }),
  };

  return (
    <Script
      id="tvshow-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pii Movie',
    description:
      'Discover, search, and explore movies and TV shows. Find detailed information, cast, crew, reviews, and more.',
    url: 'https://piimovie.pnoya.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://piimovie.pnoya.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
