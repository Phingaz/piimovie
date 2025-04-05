'use client';
import { useMainCtx } from '@/app/_context/Main';
import { MovieCategory } from '@/app/types/movies';
import { ShowCategory } from '@/app/types/show';
import { Queries } from '@/lib/enums';
import Link from 'next/link';
import React from 'react';

const SeeMore = ({ category }: { category: MovieCategory | ShowCategory }) => {
  const { type } = useMainCtx();
  const query = Queries(category, type);

  return (
    <Link
      onClick={() => {
        if (!window) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="text-sm font-[600] transition hover:text-blue-500 hover:scale-105"
      href={`/listing?${query[category]}`}
    >
      See more
    </Link>
  );
};

export default SeeMore;
