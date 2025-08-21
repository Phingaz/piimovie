'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Plus, Trash2, Send, Check } from 'lucide-react';
import ModalComponent from '../general/Modal';
import { useWebhook } from '@/app/_hooks/useWebhook';
import { toast } from 'sonner';
import { Switch } from '../ui/switch';
import { FilterTitle } from '../utils/FilterHelpers';
import { WebhookConfig } from '@prisma/client';
import type { JsonValue } from '@prisma/client/runtime/library';
import { useDbPropsCtx } from '@/app/_context/DbProps';
import { addWebhookConfig, deleteWebhookConfig } from '@/app/_queries/dbProps';
import { useMainCtx } from '@/app/_context/Main';
import { useRouter } from 'next/navigation';

interface WebhookHeader {
  key: string;
  value: string;
}

export interface LocalWebhookConfig {
  url: string;
  sendAlways: boolean;
  headers: WebhookHeader[];
}

export default function WebhookConfigModal() {
  const { webhookConfig: webHooks } = useDbPropsCtx();
  const { user } = useMainCtx();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [config, setConfig] = useState<LocalWebhookConfig>({
    url: '',
    sendAlways: false,
    headers: [{ key: 'Authorization', value: 'Bearer ' }],
  });
  const [canSave, setCanSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const transformedConfig: WebhookConfig = {
    id: 'test-webhook',
    url: config.url,
    headers: config.headers as unknown as JsonValue,
    sendAlways: config.sendAlways,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'test-user',
  };

  const sendWebhook = useWebhook([transformedConfig]);

  const handleUrlChange = (value: string) => {
    setConfig((prev) => ({ ...prev, url: value }));
  };

  const addHeader = () => {
    setConfig((prev) => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '' }],
    }));
  };

  const removeHeader = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index),
    }));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    setConfig((prev) => ({
      ...prev,
      headers: prev.headers.map((header, i) => (i === index ? { ...header, [field]: value } : header)),
    }));
  };

  const isValidConfig =
    config.url.trim() !== '' && config.headers.every((h) => h.key.trim() !== '' && h.value.trim() !== '');

  const testWebhook = async () => {
    if (!isValidConfig) {
      toast.error('Please complete the webhook configuration first');
      return;
    }

    setIsTestingWebhook(true);
    try {
      const testData = {
        id: 1396,
        poster_path: '/3xnWaLQlelqQFmKU2aGpkJjXQMx.jpg',
        title: 'Breaking Bad',
        vote_average: 8.5,
        type: 'tv',
        userId: 'test-user-id',
        createdAt: new Date(),
        lastRatingSync: new Date(),
      };

      const success = await sendWebhook(testData, 'tv', true);
      if (success) {
        toast.success('Webhook test successful!');
        setCanSave(true);
      } else {
        toast.error('Webhook test failed - check console for details');
      }
    } catch (error) {
      console.error('Test webhook error:', error);
      toast.error('Webhook test failed');
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const saveWebhook = async () => {
    if (!isValidConfig) {
      toast.error('Please complete the webhook configuration first');
      return;
    }

    setIsSaving(true);
    try {
      if (!user) return;
      await addWebhookConfig(config, user);
      toast.success('Webhook saved successfully');
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error('Save webhook error:', error);
      toast.error('Failed to save webhook');
    } finally {
      setIsSaving(false);
      setCanSave(false);
    }
  };

  const deleteWebhook = async (id?: string) => {
    try {
      if (!user || !id) return;
      await deleteWebhookConfig(user.id, id);
      toast.success('Webhook deleted successfully');
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error('Delete webhook error:', error);
      toast.error('Failed to delete webhook');
    }
  };

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
            //   autoComplete="off"
            // autoCapitalize="off"
            value={config.url}
            placeholder="https://your-webhook-url.com"
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full h-12 px-3 py-2 text-sm bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
          />
          <p className="text-xs text-gray-500">Enter the full webhook URL where media requests will be sent</p>
        </div>

        <WebHookHeaders addHeader={addHeader} config={config} updateHeader={updateHeader} removeHeader={removeHeader} />

        {/* Configuration Preview */}
        {config.url && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Configuration Preview</label>
            <div className="p-3 bg-gray-900 border border-gray-600 rounded-md text-xs">
              <div className="text-gray-400">POST {config.url}</div>
              {config.headers.length > 0 && (
                <div className="text-gray-400 mt-2">
                  <div className="mb-1">Headers:</div>
                  {config.headers.map((header, index) => (
                    <div key={index} className="ml-2">
                      <span className="text-blue-400">{header.key}:</span>
                      <span className="text-gray-300 ml-1">
                        {header.value.length > 20 ? `${header.value.substring(0, 20)}...` : header.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <FilterTitle>{!config.sendAlways ? 'Send on Favorite' : 'Send on Favorite & Unfavorite'}</FilterTitle>
          <Switch
            checked={config.sendAlways}
            onCheckedChange={(checked) => setConfig({ ...config, sendAlways: checked })}
          />
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

function WebHookHeaders({
  addHeader,
  config,
  updateHeader,
  removeHeader,
}: {
  addHeader: () => void;
  config: LocalWebhookConfig;
  updateHeader: (index: number, field: 'key' | 'value', value: string) => void;
  removeHeader: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">Headers</label>
        <Button variant="outline" size="sm" onClick={addHeader} className="text-xs">
          <Plus size={16} />
          Add Header
        </Button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {config.headers.map((header, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Header Key (e.g., Authorization)"
                value={header.key}
                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Header Value (e.g., Bearer your-token)"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  className="w-full h-10 px-3 py-2 pr-10 text-sm bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeHeader(index)}
              className="mt-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>

      {config.headers.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No headers configured</p>
          <p className="text-xs">Add headers for authentication or other requirements</p>
        </div>
      )}
    </div>
  );
}

function WebHookStatus({
  isValidConfig,
  testWebhook,
  isTestingWebhook,
  canSave,
  saveWebhook,
  isSaving,
}: {
  isValidConfig: boolean;
  testWebhook: () => Promise<void>;
  isTestingWebhook: boolean;
  canSave: boolean;
  saveWebhook: () => Promise<void>;
  isSaving: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-gray-900 border border-gray-600">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isValidConfig ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-300">
          {isValidConfig ? 'Configuration is valid' : 'Configuration incomplete'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {isValidConfig && (
          <Button variant="outline" size="sm" onClick={testWebhook} disabled={isTestingWebhook} className="text-xs">
            <Send size={14} />
            {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
          </Button>
        )}
        {canSave && (
          <Button size="sm" variant="outline" onClick={saveWebhook} disabled={!canSave || isSaving} className="text-xs">
            <Check size={14} /> {isSaving ? 'Saving...' : 'Save Webhook'}
          </Button>
        )}
        <span className="text-xs text-gray-500">{!isValidConfig && 'Please fill all required fields'}</span>
      </div>
    </div>
  );
}

function WebHookInfo() {
  return (
    <div className="space-y-2 text-xs text-gray-500">
      <p>
        <strong>How it works:</strong> When you favorite a TV show or movie, a webhook will be sent to the configured
        URL with the media details.
      </p>
      <p>
        <strong>Required format:</strong> The webhook sends a POST request with JSON body containing: query (title),
        type (tv/movie), tmdbId, and optional year.
      </p>
      <p>
        <strong>Example:</strong> POST /webhook/media with body:{' '}
        {JSON.stringify({ query: 'Breaking Bad', type: 'tv', tmdbId: 1396 })}
      </p>
    </div>
  );
}
