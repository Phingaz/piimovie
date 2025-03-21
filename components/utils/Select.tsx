'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { updateSearchParam } from '@/lib/utils';
import { useMainCtx } from '@/app/_context/Main';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  name?: string;
  required?: boolean;
}

export default function Select({
  options,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  error,
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const list = useSearchParams().get('list');
  const { startTransition } = useMainCtx();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedValue, setSelectedValue] = useState(list);
  const selectRef = useRef<HTMLDivElement>(null);

  // Find the selected option label
  const selectedOption = options.find((option) => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    setSelectedValue(option.value);
    setIsOpen(false);

    updateSearchParam({
      param: { list: option?.value ?? null, page: '1' },
      router,
      searchParams,
      startTransition,
    });
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="w-[130px]">
      <div ref={selectRef} className={`relative ${className}`}>
        <div
          id={name}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${name}-options`}
          aria-disabled={disabled}
          className={`flex items-center justify-between w-full px-3 h-[45px] text-left bg-gray-900 border rounded-md cursor-default focus:outline-none select-none ${
            disabled ? 'opacity-50 cursor-not-allowed border-gray-700' : 'border-gray-600 hover:border-gray-500'
          } ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          onClick={toggleDropdown}
        >
          <span className={`block truncate text-sm ${!selectedValue ? 'text-gray-400' : 'text-white'}`}>
            {displayText}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </div>

        {isOpen && (
          <ul
            id={`${name}-options`}
            role="listbox"
            aria-labelledby={name}
            className="absolute z-540 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none text-[15px]"
          >
            {options.map((option) => (
              <li
                key={option.value}
                id={`${name}-option-${option.value}`}
                role="option"
                aria-selected={selectedValue === option.value}
                className={`px-3 py-2 cursor-pointer ${
                  option.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : selectedValue === option.value
                    ? 'bg-blue-600 text-white'
                    : 'text-white hover:bg-gray-700'
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
