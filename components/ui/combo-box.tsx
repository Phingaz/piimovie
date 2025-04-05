'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SelectOption } from '../utils/Select';

export function MultiSelectCombobox({
  title,
  options,
  selectedValues,
  setSelectedValues,
}: {
  title: string;
  options: SelectOption[];
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [open, setOpen] = React.useState(false);

  const toggleSelection = (currentValue: string) => {
    setSelectedValues((prevSelected) =>
      prevSelected.includes(currentValue)
        ? prevSelected.filter((value) => value !== currentValue)
        : [...prevSelected, currentValue],
    );
  };

  const isSelected = (value: string) => selectedValues.includes(value);
  const isAllSelected = selectedValues.length === options.length;
  const isNoneSelected = selectedValues.length === 0;
  const isSomeSelected = selectedValues.length > 0 && selectedValues.length < options.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {isNoneSelected && `Select ${title}`}
          {isSomeSelected && `${selectedValues.length} ${title} selected`}
          {isAllSelected && `All ${title} selected`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border border-gray-500" align='start'>
        <Command>
          <CommandInput placeholder={`Search ${title}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {title} found.</CommandEmpty>
            <CommandGroup className=''>
              {options.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    onSelect={() => toggleSelection(option.value)}
                  >
                    {option.label}
                    <Check className={cn('ml-auto', isSelected(option.value) ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
