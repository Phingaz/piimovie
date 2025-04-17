import ENV from '@/lib/env';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/', '/api', '/favorites'],
    },
    sitemap: `${ENV.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
