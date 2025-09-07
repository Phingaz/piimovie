'use client';
import { useMainCtx } from '@/app/_context/Main';
import { ListType } from '@/app/_types/utils';
import { clientToastError } from '@/lib/utils';
import { movie } from '@prisma/client';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useSendWebhook } from '@/app/_hooks/useSendWebhook';
import useWebHookConfig from '@/app/_hooks/useWebHookConfig';

const SendWebhook = ({ type, movie, isLarge = false }: { type: ListType; isLarge?: boolean; movie: movie }) => {
  const { user } = useMainCtx();
  const { webHooks } = useWebHookConfig();
  const sendWebhook = useSendWebhook(webHooks);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!user || !webHooks || webHooks.length === 0) return null;

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      event.stopPropagation();

      if (!user) {
        toast.error('Please sign in to send webhooks');
        return;
      }

      const success = await sendWebhook(movie, type);
      if (success) {
        toast.success('Webhook sent successfully');
      } else {
        toast.error('Failed to send webhook');
      }
    } catch (error) {
      clientToastError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      aria-label="Send webhook"
      disabled={isLoading}
      whileTap={{ scale: 0.8 }}
      onClick={handleClick}
      className={`p-[6px] rounded-[6px] w-fit bg-gray-700/50 ${isLarge ? 'scale-125' : 'scale-90'}`}
    >
      <Send size={20} className="text-gray-300 cursor-pointer transition" />
    </motion.button>
  );
};

export default SendWebhook;
