const ENV = {
  NODE_ENV: process.env.NODE_ENV!,

  TMDB_API_KEY: process.env.TMDB_API_KEY!,
  TMDB_URL: process.env.TMDB_URL!,

  COOKIE_PREFIX: process.env.COOKIE_PREFIX!,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,

  BASEURL: process.env.BASEURL!,
  DATABASE_URL: process.env.DATABASE_URL!,
};
export default ENV;
