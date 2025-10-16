'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SelectComponent } from './Select';
import { cn } from '@/lib/utils';
import useCookies from '@/app/_hooks/useCookies';

const OPTIONS = [20, 30, 50, 100, 200].map((num) => ({ value: String(num), label: String(num) }));

export default function PerPageSelector({ className = '' }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qp = Number(searchParams.get('per'));
  const { getCookie, setCookie } = useCookies();

  const perPage = Number(getCookie('perPage')) || 20;

  useEffect(() => {
    if (qp && qp !== perPage) setCookie('perPage', String(qp));
  }, [perPage, qp, setCookie]);

  const onChange = (v: number) => {
    setCookie('perPage', String(v));

    const params = new URLSearchParams(searchParams.toString());
    params.set('per', String(v));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <SelectComponent
      className={cn('w-fit', className)}
      value={String(perPage)}
      defaultValue={String(perPage)}
      setValue={(e) => onChange(Number(e))}
      options={OPTIONS}
    />
  );
}
