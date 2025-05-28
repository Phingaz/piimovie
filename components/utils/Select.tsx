'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn, updateSearchParam } from '@/lib/utils';
import { useMainCtx } from '@/app/_context/Main';

export interface SelectOption {
  value: string;
  label: string;
}

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SelectComponentCategory = ({
  defaultValue,
  options,
}: {
  defaultValue: string | null;
  options: SelectOption[];
}) => {
  const { startTransition } = useMainCtx();

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (option: string) => {
    updateSearchParam({
      param: { category: option ?? null, page: '1' },
      router,
      searchParams,
      startTransition,
    });
  };

  return (
    <Select onValueChange={handleSelect} defaultValue={defaultValue as string}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export const SelectComponent = ({
  setValue,
  options,
  className,
}: {
  className?: string;
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  options: SelectOption[];
}) => {
  const handleSelect = (el: string) => setValue(el);

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className={cn('w-fit', className)}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectComponentCategory;
