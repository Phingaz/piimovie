'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Switch } from '@/components/ui/switch';
import { SelectComponentUrl } from './Select';
import { countries, globalGenres, releaseType, sortOptions } from '@/lib/arrys';
import { cn } from '@/lib/utils';
import { ListType } from '@/app/types/utils';
import { useFilterDate, useFilterState, useQueryParams } from '@/app/_hooks/useQueryParams';
import { CheckBoxes, FilterTitle, MultiComboBoxes, Sliders } from './FilterHelpers';
import { DatePickerRanged } from '../ui/date-picker';

export const FilterSection = ({ className, type }: { className?: string; type: ListType }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateQueryParams = useQueryParams();

  const isMovie = type === 'movie';
  const includeAdult = searchParams.get('include_adult') === 'true';

  const {
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
  } = useFilterState();

  const { date, setDate } = useFilterDate();

  return (
    <div
      className={cn(
        'flex flex-col gap-4 text-gray-300 border border-dashed border-gray-500/50 rounded-md p-5 bg-gray-800/50 h-fit space-y-5',
        className,
      )}
    >
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-semibold">Filters</h3>
        <button
          onClick={() => {
            setDate(undefined);
            router.push(window.location.pathname);
          }}
          className="text-xs py-1 px-2 rounded-sm text-main hover:text-main/90 bg-blue-900 cursor-pointer hover:bg-blue-800 transition-colors duration-200"
        >
          Reset
        </button>
      </div>

      <div>
        <FilterTitle>Release date</FilterTitle>
        <DatePickerRanged date={date} setDate={setDate} />
      </div>

      <div>
        <FilterTitle>Sort By</FilterTitle>
        <SelectComponentUrl paramKey={'sort_by'} options={sortOptions(type)} />
      </div>

      <MultiComboBoxes
        label="country"
        options={countries}
        selectedValues={selectedCountries}
        setSelectedValues={setSelectedCountries}
      >
        Include country
      </MultiComboBoxes>

      <MultiComboBoxes label="genres" options={globalGenres} selectedValues={genres} setSelectedValues={setGenres}>
        Include genres
      </MultiComboBoxes>

      <MultiComboBoxes
        label="genres"
        options={globalGenres}
        selectedValues={excludedGenres}
        setSelectedValues={setExcludedGenres}
      >
        Exclude genres
      </MultiComboBoxes>

      <div>
        <FilterTitle>Include Adult</FilterTitle>
        <Switch checked={includeAdult} onCheckedChange={(checked) => updateQueryParams('include_adult', checked)} />
      </div>

      <Sliders title="Vote Count" min={0} max={1000} value={voteCount} setValue={setVoteCount}>
        {voteCount} and above
      </Sliders>

      <Sliders title="Average Rating" min={0} max={10} value={voteAverage} setValue={setVoteAverage}>
        {voteAverage} star{voteAverage > 1 && 's'} {voteAverage < 10 ? 'and above' : ''}
      </Sliders>

      {isMovie && (
        <CheckBoxes options={releaseType} paramKey="with_release_type">
          Release Type
        </CheckBoxes>
      )}
    </div>
  );
};
