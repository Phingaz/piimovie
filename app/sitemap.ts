import { MetadataRoute } from 'next';
import ENV from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...staticPages, ...movieCategoryPages, ...tvCategoryPages];
}
