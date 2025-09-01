import { Button } from '@/components/ui/button';
import { Check, Send } from 'lucide-react';
import React from 'react';

const WebHookStatus = ({
  isValidConfig,
  testWebhook,
  isTestingWebhook,
  canSave,
  saveWebhook,
  isSaving,
}: {
  canSave: boolean;
  isSaving: boolean;
  isValidConfig: boolean;
  isTestingWebhook: boolean;
  testWebhook: () => Promise<void>;
  saveWebhook: () => Promise<void>;
}) => {
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
};

export default WebHookStatus;
