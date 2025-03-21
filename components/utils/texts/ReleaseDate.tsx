import { formatDate } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import React from 'react';

const ReleaseDate = ({ release_date, isCard }: { isCard?: boolean; release_date: string }) => {
  const cleanDate = formatDate(release_date);

  return (
    <span className={`flex items-center gap-2 ${isCard ? 'scale-75' : 'scale-100'}`}>
      <Calendar size={20} />
      <p className="text-sm">{cleanDate}</p>
    </span>
  );
};

export default ReleaseDate;
