'use client';

import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import ModalComponent from '../general/Modal';
import { Switch } from '../ui/switch';
import { FilterTitle } from '../utils/FilterHelpers';
import { WebhookHeader } from '@/app/_types/utils';
import WebHookList from './webhook/List';
import WebHookStatus from './webhook/Status';
import WebHookHeaders from './webhook/Headers';
import WebHookInfo from './webhook/Info';
import useWebHookConfig from '@/app/_hooks/useWebHookConfig';

export interface LocalWebhookConfig {
  url: string;
  isJellyseerr: boolean;
  headers: WebhookHeader[];
}

export default function WebhookConfigModal() {
  const {
    open,
    setOpen,
    canSave,
    isSaving,
    isTestingWebhook,
    testWebhook,
    saveWebhook,
    deleteWebhook,
    isValidConfig,
    webHooks,
    url,
    setUrl,
    headers,
    setHeaders,
    isJellyseerr,
    setIsJellyseerr,
  } = useWebHookConfig();

  return (
    <ModalComponent
      open={open}
      setOpen={setOpen}
      trigger={
        <Button variant="dropdown" className="has-[>svg]:px-0 p-0 h-fit justify-start">
          <Settings strokeWidth={2} size={25} />
          Webhook Settings
        </Button>
      }
      title="Webhook Configuration"
      description="Configure the webhook URL and headers for sending Movies and TV shows you added or removed from your favorites."
      className="sm:max-w-[700px]"
    >
      <div className="grid gap-6 py-4">
        {/* Webhook URL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="webhook-url" className="text-sm font-medium text-gray-300">
              Webhook URL
            </label>
          </div>
          <input
            required
            type="url"
            id="webhook-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-webhook-url.com"
            className="w-full h-12 px-3 py-2 text-sm bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
          />
          <p className="text-xs text-gray-500">Enter the full webhook URL where media requests will be sent</p>
        </div>

        <WebHookHeaders url={url} headers={headers} setHeaders={setHeaders} />

        <div>
          <FilterTitle>Jellyseerr Integration</FilterTitle>
          <div className="flex flex-col space-y-2">
            <Switch
              checked={isJellyseerr}
              onCheckedChange={(checked) => {
                setIsJellyseerr(checked);

                if (checked) {
                  if (!url.includes('/api/v1/request')) {
                    const urlParts = url.match(/^(https?:\/\/[^\/]+)/);
                    const baseUrl = urlParts ? urlParts[1] : url;
                    setUrl(`${baseUrl}/api/v1/request`);
                  }

                  // Add X-Api-Key header if it doesn't exist
                  const hasApiKey = headers.some((h) => h.key === 'X-Api-Key');
                  if (!hasApiKey) {
                    setHeaders((prev) => [...prev, { key: 'X-Api-Key', value: '' }]);
                  }
                }
              }}
            />
            <span className="text-xs text-gray-500">
              {isJellyseerr ? 'Using Jellyseerr-specific format for requests' : 'Using standard webhook format'}
            </span>
            {isJellyseerr && (
              <div className="mt-2 p-2 bg-blue-900/20 border border-blue-800 rounded-md">
                <p className="text-xs text-blue-400">
                  <strong>Jellyseerr Mode:</strong> Requests will be sent to Jellyseerr&apos;s API in the proper format.
                </p>
                <p className="text-xs text-blue-400 mt-1">
                  Make sure your URL ends with <code>/api/v1/request</code> and you&apos;ve added your API key.
                </p>
              </div>
            )}
          </div>
        </div>

        <WebHookStatus
          isValidConfig={isValidConfig}
          testWebhook={testWebhook}
          isTestingWebhook={isTestingWebhook}
          canSave={canSave}
          saveWebhook={saveWebhook}
          isSaving={isSaving}
        />

        <WebHookInfo />
        <WebHookList webHooks={webHooks} deleteWebhook={deleteWebhook} />
      </div>
    </ModalComponent>
  );
}
