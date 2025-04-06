'use client';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { SelectOption } from './Select';
import { useQueryParams } from '@/app/_hooks/useQueryParams';
import { ListType } from '@/app/types/utils';
import { FilterSection } from './Filter';
import { MultiSelectCombobox } from '../ui/combo-box';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export const FilterTitle = ({ children, className }: { children: string; className?: string }) => {
  return <p className={cn('font-medium text-gray-300 text-[12px] mb-1.5', className)}>{children}</p>;
};

export const CheckBoxes = ({
  options,
  children,
  paramKey,
}: {
  options: SelectOption[];
  children: string;
  paramKey: string;
}) => {
  const searchParams = useSearchParams();
  const updateQueryParams = useQueryParams();

  const urlValues = searchParams.get(paramKey) || '';
  const values = urlValues.split('|').filter(Boolean);

  const isChecked = (value: string) => values.includes(value.toString());

  return (
    <div>
      <FilterTitle>{children}</FilterTitle>
      <div className="space-y-2">
        {options?.map((otpion, i) => (
          <div key={i + otpion.value} className="flex items-center space-x-2">
            <Checkbox
              id={(i + otpion.value).toString()}
              checked={isChecked(otpion.value.toString())}
              onCheckedChange={() => {
                const newValues = isChecked(otpion.value.toString())
                  ? values.filter((g) => g !== otpion.value.toString())
                  : [...values, otpion.value.toString()];

                updateQueryParams(paramKey, newValues);
              }}
            />
            <label
              htmlFor={`otpion${otpion.value}`}
              className="text-xs font-[500] leading-none cursor-pointer capitalize"
            >
              {otpion.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Sliders = ({
  title,
  children,
  min,
  max,
  value,
  setValue,
}: {
  title: string;
  children: React.ReactNode;
  min: number;
  max: number;
  value: number;
  setValue: (value: number) => void;
}) => {
  return (
    <div>
      <FilterTitle>{title}</FilterTitle>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={([value]) => setValue(value)}
        className="mb-2"
      />
      <div className="text-xs">{children}</div>
    </div>
  );
};

export const MultiComboBoxes = ({
  label,
  children,
  options,
  selectedValues,
  setSelectedValues,
}: {
  label: string;
  children: string;
  options: SelectOption[];
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  return (
    <div>
      <span className="flex justify-between items-end mb-2">
        <FilterTitle className="mb-0">{children}</FilterTitle>
        {selectedValues.length > 0 && <ResetButton onClick={() => setSelectedValues([])} />}
      </span>
      <MultiSelectCombobox
        title={label}
        options={options}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
      />
      <div className="mt-1 flex flex-wrap gap-1">
        {selectedValues.length > 0 &&
          selectedValues.map((item, index) => (
            <span
              key={index}
              className="text-[12px] text-gray-400 mt-1 cursor-pointer mr-1 border p-1 rounded-sm border-gray-500/50"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedValues((prev) => prev.filter((_, i) => i !== index));
              }}
            >
              {item}
            </span>
          ))}
      </div>
    </div>
  );
};

export const MobileFilter = ({ type }: { type: ListType }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="mb-4 md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="px-3 h-[45px] rounded-md w-fit bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors duration-200 flex items-center gap-2">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[60svh] rounded-tl-3xl rounded-tr-3xl">
          <div className="overflow-y-auto h-[calc(80svh-80px)] hidden-scrollbar pt-5">
            <FilterSection type={type} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const ResetButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="outline"
      className="h-fit w-fit p-0 px-2 py-1 text-[10px] text-gray-400 rounded-sm"
      onClick={() => onClick()}
    >
      Clear
    </Button>
  );
};
