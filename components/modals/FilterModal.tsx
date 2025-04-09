import React from 'react';
import ModalComponent from '../general/Modal';
import { Button } from '../ui/button';
import { useFilterName } from '@/app/_hooks/useQueryParams';

const FilterModal = ({ fromDate, toDate }: { fromDate: Date | undefined; toDate: Date | undefined }) => {
  const { open, setOpen, filterName, handleAddToFilter, setFilterName } = useFilterName(fromDate, toDate);

  return (
    <ModalComponent
      open={open}
      setOpen={setOpen}
      title="Save filter"
      description="Save this filter as a new filter"
      trigger={
        <Button onClick={async () => {}} className="w-full bg-gray-800/30 border border-gray-500/50 hover:bg-gray-800">
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
  );
};

export default FilterModal;
