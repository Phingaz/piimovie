import React from 'react';
import { LocalWebhookConfig } from '../WebhookConfigModal';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const WebHookHeaders = ({
  url,
  headers,
  setHeaders,
}: {
  url: string;
  headers: LocalWebhookConfig['headers'];
  setHeaders: React.Dispatch<React.SetStateAction<LocalWebhookConfig['headers']>>;
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">Headers</label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setHeaders([...headers, { key: '', value: '' }])}
          className="text-xs"
        >
          <Plus size={16} />
          Add Header
        </Button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {headers.map((header, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Header Key (e.g., Authorization)"
                value={header.key}
                onChange={(e) => {
                  const newHeaders = [...headers];
                  newHeaders[index].key = e.target.value;
                  setHeaders(newHeaders);
                }}
                className="w-full h-10 px-3 py-2 text-sm bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
              />
              <div className="relative">
                <input
                  type="password"
                  placeholder="Header Value (e.g., Bearer your-token)"
                  value={header.value}
                  onChange={(e) => {
                    const newHeaders = [...headers];
                    newHeaders[index].value = e.target.value;
                    setHeaders(newHeaders);
                  }}
                  className="w-full h-10 px-3 py-2 pr-10 text-sm bg-gray-900 border border-gray-600 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newHeaders = [...headers];
                newHeaders.splice(index, 1);
                setHeaders(newHeaders);
              }}
              className="mt-1 text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>

      {headers.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">No headers configured</p>
          <p className="text-xs">Add headers for authentication or other requirements</p>
        </div>
      )}

      {url && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Configuration Preview</label>
          <div className="p-3 bg-gray-900 border border-gray-600 rounded-md text-xs">
            <div className="text-gray-400">POST {url}</div>
            {headers.length > 0 && (
              <div className="text-gray-400 mt-2">
                <div className="mb-1">Headers:</div>
                {headers.map((header, index) => (
                  <div key={index} className="ml-2">
                    <span className="text-blue-400">{header.key}:</span>
                    <span className="text-gray-300 ml-1">
                      {header.value ? '*'.repeat(Math.min(header.value.length, header.value.length)) : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebHookHeaders;
