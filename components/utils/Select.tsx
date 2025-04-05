'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { updateSearchParam } from '@/lib/utils';
import { useMainCtx } from '@/app/_context/Main';

export interface SelectOption {
  value: string;
  label: string;
}

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateSort } from '@/app/_hooks/useQueryParams';

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
  value,
  setValue,
  options,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  options: SelectOption[];
}) => {
  const handleSelect = (el: string) => setValue(el);

  return (
    <Select onValueChange={handleSelect} defaultValue={value}>
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

export const SelectComponentUrl = ({ paramKey, options }: { paramKey: string; options: SelectOption[] }) => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramKey) || options[0].value);

  useUpdateSort({ key: paramKey, sortBy: value, scroll: true });

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full">
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
