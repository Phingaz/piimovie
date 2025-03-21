'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { updateSearchParam } from '@/lib/utils';
import { useMainCtx } from '@/app/_context/Main';

export interface SelectOption {
  value: string;
  label: string;
}

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SelectComponent = ({ defaultValue, options }: { defaultValue: string | null; options: SelectOption[] }) => {
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
        <SelectValue placeholder="Select a fruit" />
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

export default SelectComponent;
