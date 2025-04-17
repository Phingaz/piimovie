'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Switch } from '@/components/ui/switch';
import { SelectComponent } from './Select';
import { countries, movieGenres, releaseType, sortOptions, tvGenres } from '@/lib/arrays';
import { cn } from '@/lib/utils';
import { useFilterState, useQueryParams } from '@/app/_hooks/useQueryParams';
import { CheckBoxes, FilterTitle, MultiComboBoxes, ResetButton, Sliders } from './FilterHelpers';
import { FilterEnum } from '@/lib/enums';
import { DatePicker } from '../ui/date-picker';
import useCookies from '@/app/_hooks/useCookies';
import { ListType } from '@/app/_types/utils';
import FilterModal from '../modals/FilterModal';

export const FilterSection = ({ className }: { className?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateQueryParams = useQueryParams();
  const { getCookie } = useCookies();
  const type = getCookie('t') as ListType;
  const isMovie = type === 'movie';

  const includeAdult = searchParams.get(FilterEnum.INCLUDE_ADULT) === 'true';

  const {
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
    excludedGenres,
    setExcludedGenres,
    selectedGenres,
    setSelectedGenres,
  } = useFilterState();

  return (
    <div
      className={cn(
        'flex flex-col gap-4 text-gray-300 border border-dashed border-gray-500/50 rounded-3xl md:rounded-md p-5 pt-10 md:p-5 bg-gray-800/50 h-fit space-y-6',
        className,
      )}
    >
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-semibold">Filters</h3>
        <button
          onClick={() => router.push(window.location.pathname)}
          className="text-xs py-1 px-2 rounded-sm text-main hover:text-main/90 bg-blue-900 cursor-pointer hover:bg-blue-800 transition-colors duration-200"
        >
          Reset
        </button>
      </div>

      <div>
        <div className="flex justify-between items-end mb-2">
          <FilterTitle className="mb-0">Release date</FilterTitle>
          {(fromDate || toDate) && (
            <ResetButton
              onClick={() => {
                if (fromDate) setFromDate(undefined);
                if (toDate) setToDate(undefined);
              }}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-gray-300 text-[11px] mb-1">From</p>
            <DatePicker date={fromDate} setDate={setFromDate} />
          </div>
          <div>
            <p className="text-gray-300 text-[11px] mb-1">To</p>
            <DatePicker date={toDate} setDate={setToDate} />
          </div>
        </div>
      </div>

      <div>
        <FilterTitle>Sort by</FilterTitle>
        <SelectComponent className="w-full" value={sortBy} setValue={setSortBy} options={sortOptions(type)} />
      </div>

      <MultiComboBoxes
        label="country"
        options={countries}
        selectedValues={selectedCountries}
        setSelectedValues={setSelectedCountries}
      >
        Include country
      </MultiComboBoxes>

      <MultiComboBoxes
        label="genres"
        options={isMovie ? movieGenres : tvGenres}
        selectedValues={excludedGenres}
        setSelectedValues={setExcludedGenres}
      >
        Exclude genres
      </MultiComboBoxes>

      <MultiComboBoxes
        label="genres"
        options={isMovie ? movieGenres : tvGenres}
        selectedValues={selectedGenres}
        setSelectedValues={setSelectedGenres}
      >
        Include genres
      </MultiComboBoxes>

      <div>
        <FilterTitle>Include Adult</FilterTitle>
        <Switch
          checked={includeAdult}
          onCheckedChange={(checked) => updateQueryParams(FilterEnum.INCLUDE_ADULT, checked)}
        />
      </div>

      <Sliders title="Vote Count" min={0} max={1000} value={voteCount} setValue={setVoteCount}>
        {voteCount} and above
      </Sliders>

      <Sliders title="Average Rating" min={0} max={10} value={voteAverage} setValue={setVoteAverage}>
        {voteAverage} star{voteAverage > 1 && 's'} {voteAverage < 10 ? 'and above' : ''}
      </Sliders>

      {isMovie && (
        <CheckBoxes options={releaseType} paramKey={FilterEnum.WITH_RELEASE_TYPE}>
          Release type
        </CheckBoxes>
      )}

      <FilterModal fromDate={fromDate} toDate={toDate} />
    </div>
  );
};
