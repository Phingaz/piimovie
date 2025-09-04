'use client';

import { useState } from 'react';
import { useSendWebhook } from '@/app/_hooks/useSendWebhook';
import { toast } from 'sonner';
import { WebhookConfig } from '@prisma/client';
import type { JsonValue } from '@prisma/client/runtime/library';
import { useDbPropsCtx } from '@/app/_context/DbProps';
import { addWebhookConfig, deleteWebhookConfig } from '@/app/_queries/dbProps';
import { useMainCtx } from '@/app/_context/Main';
import { useRouter } from 'next/navigation';
import { LocalWebhookConfig } from '@/components/modals/WebhookConfigModal';

const useWebHookConfig = () => {
  const { webhookConfig: webHooks } = useDbPropsCtx();
  const { user } = useMainCtx();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [isJellyseerr, setIsJellyseerr] = useState<boolean>(false);

  const [canSave, setCanSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const transformedConfig: WebhookConfig = {
    id: 'test-webhook',
    url: url,
    headers: headers as unknown as JsonValue,
    isJellyseerr,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'test-user',
  };

  const sendWebhook = useSendWebhook([transformedConfig]);

  const isValidConfig = url.trim() !== '' && headers.every((h) => h.key.trim() !== '' && h.value.trim() !== '');

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

      const success = await sendWebhook(testData, 'tv');
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
      const config: LocalWebhookConfig = { url, headers, isJellyseerr };
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

  return {
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
    headers,
    setUrl,
    setHeaders,
    isJellyseerr,
    setIsJellyseerr,
  };
};

export default useWebHookConfig;
