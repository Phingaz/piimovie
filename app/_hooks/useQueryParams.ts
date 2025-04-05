import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useDebounce from './useDebounce';
import { DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { useMainCtx } from '../_context/Main';

const DEBOUNCE_TIMEOUT = 100;

export const useQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.toString()) return;

    router.replace(`?${searchParams.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const updateQueryParams = (key: string, value: string | number | boolean | string[]) => {
    const params = new URLSearchParams(searchParams);

    if (Array.isArray(value)) {
      if (value.length) {
        params.set(key, value.join('|'));
      } else {
        params.delete(key);
      }
    } else {
      if (value != null) {
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
  const searchParams = useSearchParams();
  const updateQueryParams = useQueryParams();

  const vc = Number(searchParams.get('vote_count'));
  const va = Number(searchParams.get('vote_average'));
  const cs = searchParams.get('with_origin_country')?.split('|') || [];
  const gr = searchParams.get('with_genres')?.split('|') || [];
  const egr = searchParams.get('without_genres')?.split('|') || [];

  const [voteCount, setVoteCount] = useState(vc);
  const [voteAverage, setVoteAverage] = useState(va);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(cs);
  const [genres, setGenres] = useState<string[]>(gr);
  const [excludedGenres, setExcludedGenres] = useState<string[]>(egr);

  const debouncedVoteCount = useDebounce(voteCount, DEBOUNCE_TIMEOUT);
  const debouncedVoteAverage = useDebounce(voteAverage, DEBOUNCE_TIMEOUT);
  const debouncedSelectedCountries = useDebounce(selectedCountries, DEBOUNCE_TIMEOUT);
  const debouncedGenres = useDebounce(genres, DEBOUNCE_TIMEOUT);
  const debouncedExcludedGenres = useDebounce(excludedGenres, DEBOUNCE_TIMEOUT);

  useEffect(() => {
    updateQueryParams('vote_count', debouncedVoteCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedVoteCount]);

  useEffect(() => {
    updateQueryParams('vote_average', debouncedVoteAverage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedVoteAverage]);

  useEffect(() => {
    updateQueryParams('with_origin_country', selectedCountries);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSelectedCountries]);

  useEffect(() => {
    updateQueryParams('with_genres', debouncedGenres);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGenres]);

  useEffect(() => {
    updateQueryParams('without_genres', debouncedExcludedGenres);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedExcludedGenres]);

  return {
    voteCount,
    setVoteCount,
    voteAverage,
    setVoteAverage,
    selectedCountries,
    setSelectedCountries,
    genres,
    setGenres,
    excludedGenres,
    setExcludedGenres,
  };
};

export const useFilterDate = () => {
  const searchParams = useSearchParams();
  const updateQueryParams = useQueryParams();
  const { isMovie } = useMainCtx();

  const dateLte = isMovie ? searchParams.get('release_date_lte') : searchParams.get('air_date_lte');
  const dateGte = isMovie ? searchParams.get('release_date_gte') : searchParams.get('air_date_gte');

  const [date, setDate] = useState<DateRange | undefined>(
    dateLte && dateGte ? { from: parseISO(dateGte), to: parseISO(dateLte) } : undefined,
  );

  useEffect(() => {
    if (!date) return;

    const debounceTimeout = setTimeout(() => {
      if (date.from) {
        updateQueryParams(isMovie ? 'release_date_gte' : 'air_date_gte', format(date.from, 'yyyy-MM-dd'));
      }

      if (date.to) {
        updateQueryParams(isMovie ? 'release_date_lte' : 'air_date_lte', format(date.to, 'yyyy-MM-dd'));
      }
    }, DEBOUNCE_TIMEOUT + 400);

    return () => clearTimeout(debounceTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return { date, setDate };
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
