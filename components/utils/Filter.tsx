'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Switch } from '@/components/ui/switch';
import { SelectComponentUrl } from './Select';
import { countries, movieGenres, releaseType, sortOptions, tvGenres } from '@/lib/arrys';
import { cn } from '@/lib/utils';
import { ListType } from '@/app/types/utils';
import { useFilterState, useQueryParams } from '@/app/_hooks/useQueryParams';
import { CheckBoxes, FilterTitle, MultiComboBoxes, ResetButton, Sliders } from './FilterHelpers';
import { FilterEnum } from '@/lib/enums';
import { useMainCtx } from '@/app/_context/Main';
import { DatePicker } from '../ui/date-picker';
import { Button } from '../ui/button';
import { useDbPropsCtx } from '@/app/_context/DbProps';
import ModalComponent from '../general/Modal';
import { filter } from '@prisma/client';
import { toast } from 'sonner';

export const FilterSection = ({ className, type }: { className?: string; type: ListType }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateQueryParams = useQueryParams();
  const { isMovie } = useMainCtx();
  const { addToFilter } = useDbPropsCtx();

  const includeAdult = searchParams.get(FilterEnum.INCLUDE_ADULT) === 'true';

  const {
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

  const [filterName, setFilterName] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleAddToFilter = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!filterName || filterName.trim() === '') {
      toast.error('Please enter a filter name');
      return;
    }

    const filterData = Object.values(FilterEnum).reduce(
      (acc, k) => {
        const key = k.toLowerCase();
        const value = searchParams.get(key);
        if (value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string | number | boolean>,
    );

    if (fromDate) filterData.fromDate = fromDate.toString();
    if (toDate) filterData.toDate = toDate.toString();

    if (Object.keys(filterData).length === 0) {
      toast.error('Please select at least one filter option');
      return;
    }

    const filter = {
      title: filterName,
      type: type,
      isFavorite: false,
      params: JSON.stringify(filterData),
    } as filter;

    await addToFilter(filter);
    setOpen(false);
    setFilterName('');
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-4 text-gray-300 border border-dashed border-gray-500/50 rounded-md p-5 bg-gray-800/50 h-fit space-y-6',
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

      <ModalComponent
        open={open}
        setOpen={setOpen}
        title="Save filter"
        description="Save this filter as a new filter"
        trigger={
          <Button
            onClick={async () => {}}
            className="w-full bg-gray-800/30 border border-gray-500/50 hover:bg-gray-800"
          >
            Save as a new filter
          </Button>
        }
      >
        <form>
          <div className="flex flex-col gap-2 mb-8">
            <label htmlFor="filter-name" className="text-gray-300 text-sm">
              Filter name
            </label>
            <input
              type="text"
              id="filter-name"
              value={filterName}
              autoComplete="off"
              onChange={(e) => setFilterName(e.target.value)}
              className="bg-gray-800/50 border border-gray-500/50 rounded-md p-2 placeholder:text-gray-400 text-gray-300 placeholder:text-sm px-3 outline-none"
              placeholder="Enter filter name"
            />
          </div>
          <Button
            type="submit"
            onClick={handleAddToFilter}
            className="w-full bg-gray-800/30 border border-gray-500/50 hover:bg-gray-800"
          >
            Save filter
          </Button>
        </form>
      </ModalComponent>
    </div>
  );
};
