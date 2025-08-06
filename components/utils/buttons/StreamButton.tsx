'use client';
import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/app/_hooks/useLocalStorage';

interface StreamButtonProps {
  magnetLink: string;
  title: string;
  isLarge?: boolean;
  className?: string;
}

const StreamButton: React.FC<StreamButtonProps> = ({ magnetLink, title, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [, setMagnetLink] = useLocalStorage('magnetLink', '');

  const handleStartStream = async () => {
    try {
      setLoading(true);
      setMagnetLink(magnetLink);
      router.push(`/streaming`);
    } catch (error) {
      console.error('Failed to start stream:', error);
    }
  };

  return (
    <>
      <button
        title={`Stream ${title}`}
        onClick={handleStartStream}
        disabled={!magnetLink}
        className={cn(
          `text-gray-100 bg-green-600/70 hover:bg-green-600 p-[6px] rounded-sm w-fit flex justify-center items-center group transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`,
          className,
        )}
      >
        {loading ? <Loader2 className="animate-spin size-4" /> : <Play className="size-4" />}
      </button>
    </>
  );
};

export default StreamButton;
