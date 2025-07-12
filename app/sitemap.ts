import { MetadataRoute } from 'next';
import ENV from '@/lib/env';
import { fetchDiscover } from './_queries/queries';
import { getQueryString } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = ENV.NEXT_PUBLIC_URL;

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/movie`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tv`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/listing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Movie category pages
  const movieCategories = ['popular', 'top_rated', 'upcoming', 'now_playing'];

  const movieCategoryPages = movieCategories.map((category) => ({
    url: `${baseUrl}/listing?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // TV category pages
  const tvCategories = ['popular', 'top_rated', 'airing_today', 'on_the_air'];

  const tvCategoryPages = tvCategories.map((category) => ({
    url: `${baseUrl}/listing?category=${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const movieParams = getQueryString({ category: 'popular' });
    const popularMovies = await fetchDiscover({ type: 'movie', params: movieParams });

    if (popularMovies.data?.results) {
      const moviePages = popularMovies.data.results.slice(0, 100).map((movie) => ({
        url: `${baseUrl}/movie/${movie.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
      dynamicPages.push(...moviePages);
    }

    const tvParams = getQueryString({ category: 'popular' });
    const popularShows = await fetchDiscover({ type: 'tv', params: tvParams });

    if (popularShows.data?.results) {
      const tvPages = popularShows.data.results.slice(0, 100).map((show) => ({
        url: `${baseUrl}/tv/${show.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
      dynamicPages.push(...tvPages);
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
  }

  return [...staticPages, ...movieCategoryPages, ...tvCategoryPages, ...dynamicPages];
}
