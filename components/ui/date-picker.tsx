'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRange } from 'react-day-picker';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export function DatePickerRanged({ date, setDate, className }: Props) {
  console.log('date', date);
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left text-[12px] font-normal text-gray-300',
              !date && 'text-gray-400',
            )}
          >
            <CalendarIcon className="mr size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'do LLL y')} - {format(date.to, 'do LLL y')}
                </>
              ) : (
                format(date.from, 'do LLL y')
              )
            ) : (
              <span className="font-[300]">From - To</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border border-gray-500" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            defaultMonth={date?.from}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
