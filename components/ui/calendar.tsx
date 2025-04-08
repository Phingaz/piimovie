'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from './scroll-area';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const [displayMonth, setDisplayMonth] = React.useState(props.defaultMonth || props.month || new Date());
  const years = Array.from({ length: 81 }, (_, i) => 1970 + i).filter((year) => year <= 2050);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleYearChange = (year: string) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(Number.parseInt(year));
    setDisplayMonth(newDate);
  };

  const handleMonthChange = (month: string) => {
    const monthIndex = months.findIndex((m) => m === month);
    if (monthIndex !== -1) {
      const newDate = new Date(displayMonth);
      newDate.setMonth(monthIndex);
      setDisplayMonth(newDate);
    }
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 pb-0 rounded-md', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-[13px] font-medium text-gray-400',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1 text-gray-400 opacity-100 rounded-sm',
        nav_button_next: 'absolute right-1 text-gray-400 opacity-100 rounded-sm',
        table: 'w-full border-collapse space-y-1 mt-4',
        head_row: 'flex w-full justify-between',
        head_cell: 'text-gray-300 rounded-md font-normal text-[0.8rem] flex-1 text-center',
        row: 'flex w-full mt-2 justify-between',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1 [&:has([aria-selected])]:bg-gray-300 [&:has([aria-selected].day-outside)]:bg-gray-300/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md [&:has([aria-selected])]:bg-gray-500',
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:bg-red-900 aria-selected:text-white mx-auto',
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-gray-300 hover:bg-primary hover:text-gray-300 focus:bg-primary focus:text-gray-300',
        day_today: 'border border-gray-300/70',
        day_outside: 'day-outside text-gray-500 aria-selected:bg-gray-300/50 aria-selected:text-gray-500',
        day_disabled: 'text-gray-500 opacity-50',
        day_range_middle: 'aria-selected:bg-gray-300 aria-selected:text-gray-300-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => <ChevronLeft className={cn('h-4 w-4', className)} {...props} />,
        Caption: ({ displayMonth }) => {
          return (
            <div className="flex items-center justify-evenly w-full mb-2 gap-1">
              <button
                onClick={() => {
                  const prevMonth = new Date(displayMonth);
                  prevMonth.setMonth(prevMonth.getMonth() - 1);
                  setDisplayMonth(prevMonth);
                }}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'size-7 text-gray-300 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-sm',
                )}
              >
                <ChevronLeft className="size-4" strokeWidth={2} />
              </button>

              <div className="flex gap-2 items-center">
                <Select value={displayMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="text-xs">
                          {year}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>

                <Select value={months[displayMonth.getMonth()]} onValueChange={handleMonthChange}>
                  <SelectTrigger size="sm">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {months.map((month) => (
                        <SelectItem key={month} value={month} className="text-xs">
                          {month}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              <button
                onClick={() => {
                  const nextMonth = new Date(displayMonth);
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setDisplayMonth(nextMonth);
                }}
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'size-7 text-gray-300 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-sm',
                )}
              >
                <ChevronRight className="size-4" strokeWidth={2} />
              </button>
            </div>
          );
        },
        IconRight: ({ className, ...props }) => <ChevronRight className={cn('h-4 w-4', className)} {...props} />,
      }}
      {...props}
      month={displayMonth}
      onMonthChange={setDisplayMonth}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
