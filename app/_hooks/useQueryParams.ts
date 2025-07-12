import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useDebounce from './useDebounce';
import { format, parseISO } from 'date-fns';
import { FilterEnum } from '@/lib/enums';
import { toast } from 'sonner';
import { useDbPropsCtx } from '../_context/DbProps';
import { filter } from '@prisma/client';
import useCookies from './useCookies';

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
  const router = useRouter();
  const { getCookie } = useCookies();
  const isMovie = getCookie('t') === 'movie';

  const searchParams = useSearchParams();
  const vc = Number(searchParams.get(FilterEnum.VC_GTE));
  const va = Number(searchParams.get(FilterEnum.VA_GTE));
  const cs = searchParams.get(FilterEnum.WITH_ORIGIN_COUNTRY)?.split('|') || [];
  const wg = searchParams.get(FilterEnum.WITH_GENRES)?.split('|') || [];
  const egr = searchParams.get(FilterEnum.WITHOUT_GENRES)?.split('|') || [];
  const sb = searchParams.get(FilterEnum.SORT_BY);

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
  const [sortBy, setSortBy] = useState<string | null>(sb);

  const debouncedFromDate = useDebounce(fromDate, DEBOUNCE_TIMEOUT);
  const debouncedToDate = useDebounce(toDate, DEBOUNCE_TIMEOUT);
  const debouncedVoteCount = useDebounce(voteCount, DEBOUNCE_TIMEOUT);
  const debouncedVoteAverage = useDebounce(voteAverage, DEBOUNCE_TIMEOUT);
  const debouncedSelectedCountries = useDebounce(selectedCountries, DEBOUNCE_TIMEOUT);
  const debouncedSelectedGenres = useDebounce(selectedGenres, DEBOUNCE_TIMEOUT);
  const debouncedExcludedGenres = useDebounce(excludedGenres, DEBOUNCE_TIMEOUT);

  // Consolidated useEffect for all filter updates
  useEffect(() => {
    const updates: Array<{ key: string; value: string | string[] }> = [
      { key: FilterEnum.SORT_BY, value: sortBy ?? '' },
      { key: dateGteParam, value: debouncedFromDate ? format(debouncedFromDate, 'yyyy-MM-dd') : '' },
      { key: dateLteParam, value: debouncedToDate ? format(debouncedToDate, 'yyyy-MM-dd') : '' },
      { key: FilterEnum.VC_GTE, value: debouncedVoteCount?.toString() ?? '' },
      { key: FilterEnum.VA_GTE, value: debouncedVoteAverage?.toString() ?? '' },
      { key: FilterEnum.WITH_ORIGIN_COUNTRY, value: debouncedSelectedCountries },
      { key: FilterEnum.WITH_GENRES, value: debouncedSelectedGenres },
      { key: FilterEnum.WITHOUT_GENRES, value: debouncedExcludedGenres },
    ];

    // Batch update all query parameters
    const params = new URLSearchParams(searchParams);
    let hasChanges = false;

    updates.forEach(({ key, value }) => {
      const currentValue = params.get(key);
      const newValue = Array.isArray(value) ? (value.length > 0 ? value.join('|') : '') : value;

      if (currentValue !== newValue) {
        hasChanges = true;
        if (newValue) {
          params.set(key, newValue);
        } else {
          params.delete(key);
        }
      }
    });

    // Only update URL if there are actual changes
    if (hasChanges) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [
    sortBy,
    debouncedFromDate,
    debouncedToDate,
    debouncedVoteCount,
    debouncedVoteAverage,
    debouncedSelectedCountries,
    debouncedSelectedGenres,
    debouncedExcludedGenres,
    dateGteParam,
    dateLteParam,
    searchParams,
    router,
  ]);

  const resetFilters = () => {
    setSortBy(null);
    setFromDate(undefined);
    setToDate(undefined);
    setVoteCount(0);
    setVoteAverage(0);
    setSelectedCountries([]);
    setSelectedGenres([]);
    setExcludedGenres([]);

    // Clear all search params
    const params = new URLSearchParams(searchParams);
    params.delete(FilterEnum.SORT_BY);
    params.delete(dateGteParam);
    params.delete(dateLteParam);
    params.delete(FilterEnum.VC_GTE);
    params.delete(FilterEnum.VA_GTE);
    params.delete(FilterEnum.WITH_ORIGIN_COUNTRY);
    params.delete(FilterEnum.WITH_GENRES);
    params.delete(FilterEnum.WITHOUT_GENRES);

    router.push(window.location.pathname);
  };

  return {
    sortBy,
    setSortBy,
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
    resetFilters,
  };
};

export const useFilterName = (fromDate: Date | undefined, toDate: Date | undefined) => {
  const searchParams = useSearchParams();
  const { addToFilter } = useDbPropsCtx();
  const { getCookie } = useCookies();
  const type = getCookie('t');

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
