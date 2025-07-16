import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HQBadgeProps {
  hasHQ: boolean | null;
  loading?: boolean;
  className?: string;
}

export const HQBadge: React.FC<HQBadgeProps> = ({ hasHQ, loading, className }) => {
  if (loading) {
    return (
      <div
        className={cn(
          `absolute top-2 left-2 z-1 animate-pulse grid place-content-center p-1 rounded-full bg-gray-800 text-gray-200 border border-gray-300/50`,
          className,
        )}
      >
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  if (hasHQ === true) {
    return (
      <div
        className={cn(
          `absolute top-2 left-2 z-1 text-xs flex items-center px-2 py-1 rounded-sm bg-gray-900`,
          className,
        )}
      >
        HQ
      </div>
    );
  }

  return null;
};

export default HQBadge;
