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
};
export default ENV;
