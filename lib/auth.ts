import { betterAuth } from 'better-auth';
import { createAuthClient } from 'better-auth/react';
import ENV from './env';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import db from './prisma';

export const auth = betterAuth({
  appName: 'Pii Movie',
  secret: ENV.BETTER_AUTH_SECRET,
  advanced: { cookiePrefix: ENV.COOKIE_PREFIX },
  account: { accountLinking: { trustedProviders: ['google'] } },
  trustedOrigins: [ENV.BASEURL],
  database: prismaAdapter(db, { provider: 'postgresql' }),
  emailAndPassword: { enabled: false },
  socialProviders: {
    google: {
      clientId: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      redirectURI: `${ENV.BASEURL}/api/auth/callback/google`,
      mapProfileToUser: (profile) => ({
        email: profile.email,
        name: profile.name,
        avatar: profile.picture,
      }),
    },
  },
});

export const authClient = createAuthClient({ baseURL: ENV.BASEURL });
