import { useCallback } from 'react';
import { movie, WebhookConfig } from '@prisma/client';

interface WebhookHeader {
  key: string;
  value: string;
}

// Standard webhook payload
interface MediaData {
  query: string;
  type: 'tv' | 'movie';
  year?: number;
  tmdbId?: number;
}

// Jellyseerr-specific payload
interface JellyseerrMoviePayload {
  mediaType: 'movie';
  mediaId: number;
}

interface JellyseerrTvPayload {
  mediaType: 'tv';
  mediaId: number;
  seasons: number[];
}

type JellyseerrPayload = JellyseerrMoviePayload | JellyseerrTvPayload;

export const useSendWebhook = (webHooks: WebhookConfig[] | null) => {
  const sendWebhook = useCallback(
    async (movie: movie, type: 'tv' | 'movie'): Promise<boolean> => {
      try {
        if (!webHooks || webHooks.length === 0) {
          console.warn('No webhooks configured');
          return false;
        }

        const yearMatch = movie.title.match(/\((\d{4})\)/);
        const year = yearMatch ? parseInt(yearMatch[1]) : undefined;

        // Clean title by removing year if present
        const cleanTitle = movie.title.replace(/\s*\(\d{4}\)\s*$/, '').trim();

        // Standard webhook data
        const webhookData: MediaData = {
          query: cleanTitle,
          type: type === 'movie' ? ('movie' as const) : ('tv' as const),
          tmdbId: movie.id,
          ...(year && { year }),
        };

        const results = await Promise.allSettled(
          webHooks.map(async (webHook) => {
            if (!webHook || !webHook.url) {
              return false;
            }

            // Prepare headers
            const headers: Record<string, string> = {
              'Content-Type': 'application/json',
            };

            // Parse and add configured headers
            let parsedHeaders: WebhookHeader[] = [];

            if (webHook.headers) {
              try {
                if (typeof webHook.headers === 'string') {
                  // If it's a JSON string, parse it
                  parsedHeaders = JSON.parse(webHook.headers);
                } else if (Array.isArray(webHook.headers)) {
                  // If it's already an array, use it directly
                  parsedHeaders = webHook.headers as unknown as WebhookHeader[];
                }

                // Validate and add headers
                if (Array.isArray(parsedHeaders)) {
                  parsedHeaders.forEach((header) => {
                    if (header && typeof header === 'object' && 'key' in header && 'value' in header) {
                      const { key, value } = header as WebhookHeader;
                      if (key?.trim() && value?.trim()) {
                        headers[key] = value;
                      }
                    }
                  });
                }
              } catch (error) {
                console.warn('Failed to parse webhook headers:', error);
              }
            }
            let requestBody: MediaData | JellyseerrPayload;

            if (webHook.isJellyseerr) {
              if (type === 'movie') {
                requestBody = {
                  mediaType: 'movie',
                  mediaId: movie.id,
                };
              } else {
                requestBody = {
                  mediaType: 'tv',
                  mediaId: movie.id,
                  seasons: [1],
                };
              }
            } else {
              requestBody = {
                query: webhookData.query,
                type: webhookData.type,
                ...(webhookData.year && { year: webhookData.year }),
                ...(webhookData.tmdbId && { tmdbId: webhookData.tmdbId }),
              };
            }

            const proxyUrl = '/api/webhook-proxy';

            const response = await fetch(proxyUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                webhookUrl: webHook.url,
                headers: headers,
                payload: requestBody,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Webhook failed: ${errorData.error}`);
            }

            return true;
          }),
        );

        // Return true if at least one webhook succeeded
        const successes = results.filter((result) => result.status === 'fulfilled' && result.value === true);
        return successes.length > 0;
      } catch (error) {
        console.error('Webhook error:', error);
        return false;
      }
    },
    [webHooks],
  );

  return sendWebhook;
};

export default useSendWebhook;
