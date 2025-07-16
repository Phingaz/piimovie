import { DownloadIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Download = ({ title, isLarge = true }: { title: string; isLarge?: boolean }) => {
  return (
    <Link
      href={`/download?q=${title}`}
      className={`text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit group ${isLarge ? 'scale-125' : 'scale-90'}`}
    >
      <DownloadIcon size={20} className="group-hover:animate-bounce" />
    </Link>
  );
};

export default Download;
