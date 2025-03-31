import { cn } from '@/lib/utils';
import React from 'react';

const PageTitle = ({ children, className }: { className?: string; children: string }) => {
  return <h1 className={cn('text-[35px] font-semibold text-gray-300', className)}>{children}</h1>;
};

export default PageTitle;
