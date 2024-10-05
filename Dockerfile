FROM node:18-alpine AS base

FROM base AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /client

COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm i && npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /client
COPY --from=deps /client/node_modules ./node_modules
COPY . .

RUN \
  if [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /client

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache curl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /client/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /client/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
