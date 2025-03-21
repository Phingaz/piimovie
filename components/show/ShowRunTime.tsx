import { cleanDate } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import React from 'react';

const ShowRunTime = ({ first_air_date, last_air_date }: { last_air_date: string; first_air_date: string }) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-5 w-5" />
      <span>
        {cleanDate(first_air_date)} - {cleanDate(last_air_date)}
      </span>
    </div>
  );
};

export default ShowRunTime;
