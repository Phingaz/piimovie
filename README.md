# PiiMovie

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Download Feature (Torrent Chunk Downloads)

Implemented phases:

- IndexedDB (Dexie) storage for chunked torrent downloads (encrypted optional)
- API proxy routes under `/api/downloads/*` (info, progress, chunk)
- Client download service with queue (max 3 concurrent downloads) + pause/resume/cancel
- Retry logic (exponential backoff) per chunk (4 attempts)
- Storage quota preflight (navigator.storage.estimate) + usage bar
- UI: Start form + download list with progress, speed, seeds/peers, ETA, save button

### Environment Variables

```bash
MAX_DOWNLOAD_SIZE=5368709120        # optional (default 5GB)
DEFAULT_CHUNK_SIZE=10485760         # default 10MiB
MAX_CONCURRENT_DOWNLOADS=3          # concurrent active downloads
DOWNLOAD_ENCRYPTION_ENABLED=false   # set true to AES-GCM encrypt chunks
DOWNLOAD_ENCRYPTION_SALT=piimovie.static.salt.v1
SERVER_API_URL=...                  # upstream server base
SERVER_API_KEY=...                  # X-API-Key header value
```

### Core Modules

- `lib/download-db.ts` Dexie schema (downloads, chunks)
- `lib/crypto/downloadCrypto.ts` AES-GCM helpers
- `lib/download-service.ts` orchestration (queue, polling, chunk fetching)
- `app/_hooks/useDownloadManager.ts` reactive hook for UI
- `components/downloads/*` UI components

### Starting a Download

1. Navigate to `/downloads`
2. Enter magnet link and file index (from torrent metadata endpoint)
3. (Optional) adjust chunk size
4. Start – download enters queue and begins fetching chunks sequentially

### Saving a File

When completed, click "Save" to assemble blobs and trigger a browser download.

### Encryption Notes

If enabled, each chunk is encrypted with a key derived from magnet link + file index + salt (PBKDF2 -> AES-GCM). This is obfuscation, not strong secrecy, since the salt/key derivation is reproducible.

### Future Enhancements (Not Yet Implemented)

- Worker offload for encryption
- Multi-chunk parallelism per download
- Checksum verification (pending server support)
- Export/import of stored downloads
