'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

import { WebhookConfig } from '@prisma/client';
import { FilterTitle } from '@/components/utils/FilterHelpers';
import { WebhookHeader } from '@/app/_types/utils';

const WebHookList = ({
  webHooks,
  deleteWebhook,
}: {
  webHooks: WebhookConfig[] | null;
  deleteWebhook: (id: string) => void;
}) => {
  return (
    <>
      {webHooks && webHooks.length > 0 && (
        <div className="space-y-3">
          <FilterTitle>Configured Webhooks</FilterTitle>
          <div className="space-y-2">
            {webHooks.map((webhook, index) => {
              const headers = Array.isArray(webhook.headers) ? (webhook.headers as unknown as WebhookHeader[]) : [];

              return (
                <div
                  key={webhook.id}
                  className="border border-gray-800 shadow-sm hover:scale-101 transition-all shadow-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-200 dark:text-gray-800">Webhook #{index + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-800`}>
                        {webhook.sendAlways ? 'Favorites and Unfavorites' : 'Favorites Only'}
                      </span>
                      {webhook.isJellyseerr && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">Jellyseerr</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteWebhook(webhook.id)}
                        className="mt-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-gray-400 dark:text-gray-800">
                    <div>
                      <span className="font-medium">URL:</span> {webhook.url}
                    </div>
                    <div>
                      <span className="font-medium">Headers:</span> {headers.length} configured
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(webhook.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default WebHookList;
