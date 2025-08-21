const ENV = {
  NODE_ENV: process.env.NODE_ENV!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,

  TMDB_API_KEY: process.env.TMDB_API_KEY!,
  TMDB_URL: process.env.TMDB_URL!,

  COOKIE_PREFIX: process.env.COOKIE_PREFIX!,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,

  BASEURL: process.env.BASEURL!,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL!,
  DATABASE_URL: process.env.DATABASE_URL!,
  SUPER_ADMINS: process.env.SUPER_ADMINS!,

  SERVER_API_URL: process.env.SERVER_API_URL!,
  SERVER_API_KEY: process.env.SERVER_API_KEY!,

  REDIS_URL: process.env.REDIS_URL!,
  // Download feature constants
  MAX_DOWNLOAD_SIZE: parseInt(process.env.MAX_DOWNLOAD_SIZE || `${5 * 1024 ** 3}`), // 5GB default
  DEFAULT_CHUNK_SIZE: parseInt(process.env.DEFAULT_CHUNK_SIZE || `${10_485_760}`), // 10MiB
  MAX_CONCURRENT_DOWNLOADS: parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || '3'),
  DOWNLOAD_ENCRYPTION_ENABLED: (process.env.DOWNLOAD_ENCRYPTION_ENABLED || 'false').toLowerCase() === 'true',
  DOWNLOAD_ENCRYPTION_SALT: process.env.DOWNLOAD_ENCRYPTION_SALT || 'piimovie.static.salt.v1',
};
export default ENV;
