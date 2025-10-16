'use client';
import useCookies from '@/app/_hooks/useCookies';
import { MovieCategory } from '@/app/_types/movies';
import { ShowCategory } from '@/app/_types/show';
import { FilterOption, ListType } from '@/app/_types/utils';
import { Queries } from '@/lib/enums';
import { getQueryString } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const SeeMore = ({ type, category }: { type: ListType; category: MovieCategory | ShowCategory }) => {
  const query = Queries(category, type)[category];
  const params = getQueryString(query as FilterOption);
  const { getCookie } = useCookies();

  return (
    <Link
      aria-label={`See more ${category}`}
      onClick={() => {
        if (typeof window === 'undefined') return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="text-sm font-[600] transition hover:text-blue-500 hover:scale-105"
      href={`/listing?category=${category}&${params}&per=${getCookie('perPage') || 20}`}
    >
      See more
    </Link>
  );
};

export default SeeMore;
