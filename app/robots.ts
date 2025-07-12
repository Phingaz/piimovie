import ENV from '@/lib/env';
import type { MetadataRoute } from 'next';
import db from '@/lib/prisma';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const allowBot = await db.feature_flags.findFirst({
    where: { name: 'allowBots' },
  });

  const isAllowed = allowBot?.enabled ?? false;

  return {
    rules: [
      {
        userAgent: '*',
        allow: isAllowed ? ['/'] : [],
        disallow: isAllowed ? ['/api/', '/admin/', '/search?*', '/_next/', '/favorites', '/download'] : ['/'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: isAllowed ? ['/'] : [],
        disallow: isAllowed ? ['/api/', '/admin/', '/search?*', '/_next/', '/favorites', '/download'] : ['/'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${ENV.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
