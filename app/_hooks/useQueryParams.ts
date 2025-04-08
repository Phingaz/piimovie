import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useDebounce from './useDebounce';
import { format, parseISO } from 'date-fns';
import { useMainCtx } from '../_context/Main';
import { FilterEnum } from '@/lib/enums';
import { toast } from 'sonner';
import { useDbPropsCtx } from '../_context/DbProps';
import { filter } from '@prisma/client';

const DEBOUNCE_TIMEOUT = 100;

export const useQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQueryParams = (key: string, value: string | number | boolean | string[]) => {
    const params = new URLSearchParams(searchParams);

    if (Array.isArray(value)) {
      if (value.length) {
        params.set(key, value.join('|'));
      } else {
        params.delete(key);
      }
    } else {
      if (value != null && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return updateQueryParams;
};

export const useFilterState = () => {
  const { isMovie } = useMainCtx();
  const searchParams = useSearchParams();
  const updateQueryParams = useQueryParams();
  const vc = Number(searchParams.get(FilterEnum.VC_GTE));
  const va = Number(searchParams.get(FilterEnum.VA_GTE));
  const cs = searchParams.get(FilterEnum.WITH_ORIGIN_COUNTRY)?.split('|') || [];
  const wg = searchParams.get(FilterEnum.WITH_GENRES)?.split('|') || [];
  const egr = searchParams.get(FilterEnum.WITHOUT_GENRES)?.split('|') || [];

  const dateGteParam = isMovie ? FilterEnum.PRIMARY_RELEASE_DATE_GTE : FilterEnum.FIRST_AIR_DATE_GTE;
  const dateLteParam = isMovie ? FilterEnum.PRIMARY_RELEASE_DATE_LTE : FilterEnum.FIRST_AIR_DATE_LTE;

  const dateGte = searchParams.get(dateGteParam);
  const dateLte = searchParams.get(dateLteParam);

  const [voteCount, setVoteCount] = useState(vc);
  const [voteAverage, setVoteAverage] = useState(va);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(cs);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(wg);
  const [excludedGenres, setExcludedGenres] = useState<string[]>(egr);
  const [fromDate, setFromDate] = useState<Date | undefined>(() => (dateGte ? parseISO(dateGte) : undefined));
  const [toDate, setToDate] = useState<Date | undefined>(() => (dateLte ? parseISO(dateLte) : undefined));

  const debouncedFromDate = useDebounce(fromDate, DEBOUNCE_TIMEOUT);
  const debouncedToDate = useDebounce(toDate, DEBOUNCE_TIMEOUT);
  const debouncedVoteCount = useDebounce(voteCount, DEBOUNCE_TIMEOUT);
  const debouncedVoteAverage = useDebounce(voteAverage, DEBOUNCE_TIMEOUT);
  const debouncedSelectedCountries = useDebounce(selectedCountries, DEBOUNCE_TIMEOUT);
  const debouncedSelectedGenres = useDebounce(selectedGenres, DEBOUNCE_TIMEOUT);
  const debouncedExcludedGenres = useDebounce(excludedGenres, DEBOUNCE_TIMEOUT);

  useEffect(() => {
    updateQueryParams(dateGteParam, debouncedFromDate ? format(debouncedFromDate, 'yyyy-MM-dd') : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFromDate, isMovie]);

  useEffect(() => {
    updateQueryParams(dateLteParam, debouncedToDate ? format(debouncedToDate, 'yyyy-MM-dd') : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedToDate, isMovie]);

  useEffect(() => {
    updateQueryParams(FilterEnum.VC_GTE, debouncedVoteCount ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedVoteCount]);

  useEffect(() => {
    updateQueryParams(FilterEnum.VA_GTE, debouncedVoteAverage ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedVoteAverage]);

  useEffect(() => {
    updateQueryParams(FilterEnum.WITH_ORIGIN_COUNTRY, debouncedSelectedCountries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSelectedCountries]);

  useEffect(() => {
    updateQueryParams(FilterEnum.WITH_GENRES, debouncedSelectedGenres);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSelectedGenres]);

  useEffect(() => {
    updateQueryParams(FilterEnum.WITHOUT_GENRES, debouncedExcludedGenres);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedExcludedGenres]);

  return {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    voteCount,
    setVoteCount,
    voteAverage,
    setVoteAverage,
    selectedCountries,
    setSelectedCountries,
    selectedGenres,
    setSelectedGenres,
    excludedGenres,
    setExcludedGenres,
  };
};

export const useFilterName = (fromDate: Date | undefined, toDate: Date | undefined) => {
  const searchParams = useSearchParams();
  const { addToFilter } = useDbPropsCtx();
  const { type } = useMainCtx();

  const [filterName, setFilterName] = useState('');
  const [open, setOpen] = useState(false);

  const handleAddToFilter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!filterName.trim()) {
      toast.error('Please enter a filter name');
      return;
    }

    const filterData = Object.values(FilterEnum).reduce(
      (acc, k) => {
        const key = k.toLowerCase();
        const value = searchParams.get(k);
        if (value) acc[key] = value;
        return acc;
      },
      {} as Record<string, string | number | boolean>,
    );

    if (fromDate) filterData.fromDate = format(fromDate, 'yyyy-MM-dd');
    if (toDate) filterData.toDate = format(toDate, 'yyyy-MM-dd');

    if (Object.keys(filterData).length === 0) {
      toast.error('Please select at least one filter option');
      return;
    }

    const filter = {
      title: filterName.trim(),
      type: type,
      isFavorite: false,
      params: JSON.stringify(filterData),
    } as filter;

    await addToFilter(filter);
    setOpen(false);
    setFilterName('');
  };

  return { open, setOpen, filterName, setFilterName, handleAddToFilter };
};

export const useUpdateSort = <T>({ key, sortBy, scroll = true }: { key: string; sortBy: T; scroll?: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchParamsString = searchParams.toString();

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams(searchParamsString);

    if (sortBy) {
      params.set(key, String(sortBy));
    } else {
      params.delete(key);
    }

    router.replace(`?${params.toString()}`, { scroll });
  }, [sortBy, router, key, scroll, searchParamsString]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);
};
