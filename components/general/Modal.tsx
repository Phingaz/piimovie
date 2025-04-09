'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import React from 'react';

export default function ModalComponent({
  open,
  setOpen,
  trigger,
  title,
  description,
  children,
  className,
}: {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={cn('sm:max-w-[600px] sm:max-h-[90svh] overflow-y-auto tiny-scrollbar', className)}>
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
