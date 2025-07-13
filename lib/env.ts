import { z } from 'zod';

// Client-safe environment schema (only public variables)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_URL: z.string().url('NEXT_PUBLIC_URL must be a valid URL'),
  HQ_API_KEY: z.string().optional(),
});

// Server-only environment schema
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),
  TMDB_API_KEY: z.string().min(1, 'TMDB_API_KEY is required'),
  TMDB_URL: z.string().url('TMDB_URL must be a valid URL'),
  COOKIE_PREFIX: z.string().min(1, 'COOKIE_PREFIX is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  BASEURL: z.string().url('BASEURL must be a valid URL'),
  NEXT_PUBLIC_URL: z.string().url('NEXT_PUBLIC_URL must be a valid URL'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid database URL'),
  SUPER_ADMINS: z.string().optional().default(''),
  GOOGLE_VERIFICATION_CODE: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  HQ_API_KEY: z.string(),
  HQ_API_URL: z.string().url('HQ_API_URL must be a valid URL'),
});

type ServerEnvConfig = z.infer<typeof serverEnvSchema>;
type ClientEnvConfig = z.infer<typeof clientEnvSchema>;

function validateEnv(): ServerEnvConfig | ClientEnvConfig {
  // Check if we're on the server side
  const isServer = typeof window === 'undefined';

  if (isServer) {
    try {
      return serverEnvSchema.parse({
        NODE_ENV: process.env.NODE_ENV,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        TMDB_API_KEY: process.env.TMDB_API_KEY,
        TMDB_URL: process.env.TMDB_URL,
        COOKIE_PREFIX: process.env.COOKIE_PREFIX,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        BASEURL: process.env.BASEURL,
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
        DATABASE_URL: process.env.DATABASE_URL,
        SUPER_ADMINS: process.env.SUPER_ADMINS,
        GOOGLE_VERIFICATION_CODE: process.env.GOOGLE_VERIFICATION_CODE,
        SENTRY_DSN: process.env.SENTRY_DSN,
        HQ_API_URL: process.env.HQ_API_URL,
        HQ_API_KEY: process.env.HQ_API_KEY,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingVars = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
        throw new Error(`Environment validation failed:\n${missingVars}`);
      }
      throw error;
    }
  } else {
    try {
      return clientEnvSchema.parse({
        NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const missingVars = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
        throw new Error(`Client environment validation failed:\n${missingVars}`);
      }
      throw error;
    }
  }
}

const ENV = validateEnv();

// Create a type-safe interface that works on both client and server
const envProxy = new Proxy({} as ServerEnvConfig, {
  get(target, prop: string) {
    if (typeof window === 'undefined') {
      // Server-side: return the validated environment
      return (ENV as ServerEnvConfig)[prop as keyof ServerEnvConfig];
    } else {
      // Client-side: handle different types of environment variables
      if (prop.startsWith('NEXT_PUBLIC_')) {
        return (ENV as ClientEnvConfig)[prop as keyof ClientEnvConfig];
      }

      // Allow access to safe, non-sensitive environment variables
      const safeClientVars = ['NODE_ENV'];
      if (safeClientVars.includes(prop)) {
        return process.env[prop];
      }

      // Block access to sensitive server-only variables
      const sensitiveVars = [
        'BETTER_AUTH_SECRET',
        'GOOGLE_CLIENT_SECRET',
        'DATABASE_URL',
        'TMDB_API_KEY',
        'SENTRY_DSN',
        'INTERNAL_API_KEY',
      ];

      if (sensitiveVars.includes(prop)) {
        console.warn(`Attempted to access sensitive server environment variable "${prop}" on client side`);
        return undefined;
      }

      // For other variables, return undefined instead of throwing
      return undefined;
    }
  },
});

export default envProxy;
