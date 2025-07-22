'use client';
import { cn } from '@/lib/utils';
import React from 'react';

const CarouselItem = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div className={cn(className)} onClick={onClick}>
      {children}
    </div>
  );
};

export default CarouselItem;
