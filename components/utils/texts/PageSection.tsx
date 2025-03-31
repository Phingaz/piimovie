import { cn } from '@/lib/utils';
import React from 'react';

const PageSection = ({ children, className }: { className?: string; children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        'flex md:justify-between md:items-center mb-10 md:mb-5 md:flex-row flex-col gap-3 md:gap-0',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageSection;
