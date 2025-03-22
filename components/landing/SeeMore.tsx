'use client';
import { MovieCategory } from '@/app/types/movies';
import { ShowCategory } from '@/app/types/show';
import Link from 'next/link';
import React from 'react';

const SeeMore = ({ category }: { category: MovieCategory | ShowCategory }) => {
  return (
    <Link
      onClick={() => {
        if (!window) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="text-sm font-[600] transition hover:text-blue-500 hover:scale-105"
      href={`/listing?category=${category}&page=1`}
    >
      See more
    </Link>
  );
};

export default SeeMore;
