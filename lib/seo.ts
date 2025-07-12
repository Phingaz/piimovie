export function generateMetaDescription(title: string, overview?: string, type: 'movie' | 'tv' = 'movie'): string {
  if (overview) {
    const truncated = overview.length > 155 ? overview.substring(0, 155).trim() + '...' : overview;
    return truncated;
  }

  return `Discover ${title}. Get detailed information, cast, crew, reviews, and more about this ${type === 'movie' ? 'movie' : 'TV show'}.`;
}

export function generateKeywords(
  title: string,
  genres?: Array<{ name: string }>,
  type: 'movie' | 'tv' = 'movie',
  additionalKeywords: string[] = [],
): string[] {
  const baseKeywords = [
    title.toLowerCase(),
    type === 'movie' ? 'movie' : 'tv show',
    type === 'movie' ? 'film' : 'television series',
    'watch',
    'stream',
    'review',
    'cast',
    'crew',
  ];

  const genreKeywords = genres ? genres.map((genre) => genre.name.toLowerCase()) : [];

  return [...baseKeywords, ...genreKeywords, ...additionalKeywords].filter(Boolean);
}

export function generateOGImageUrl(backdropPath?: string, posterPath?: string): string {
  if (backdropPath) {
    return `https://image.tmdb.org/t/p/w1280${backdropPath}`;
  }

  if (posterPath) {
    return `https://image.tmdb.org/t/p/w780${posterPath}`;
  }

  // Fallback to a default OG image
  return '/og-image.png';
}

export function generateCanonicalUrl(path: string, baseUrl: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}${cleanPath}`;
}

export function formatSEOTitle(title: string, suffix?: string, year?: number | string): string {
  let formattedTitle = title;

  if (year) {
    formattedTitle += ` (${year})`;
  }

  if (suffix) {
    formattedTitle += ` ${suffix}`;
  }

  return formattedTitle;
}

export function generateBreadcrumbData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function cleanTextForSEO(text: string, maxLength: number = 160): string {
  // Remove HTML tags
  const cleaned = text.replace(/<[^>]*>/g, '');

  // Normalize whitespace
  const normalized = cleaned.replace(/\s+/g, ' ').trim();

  // Truncate if necessary
  if (normalized.length > maxLength) {
    const truncated = normalized.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
  }

  return normalized;
}
