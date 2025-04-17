'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, ExternalLink, Film, FilterIcon, Star, Trash2Icon, Tv } from 'lucide-react';
import { LocalSearch } from '../utils/SearchComponent';
import { SelectComponent } from '../utils/Select';
import { favFilterType } from '@/lib/arrays';
import { getLastUsedText, getQueryString } from '@/lib/utils';
import { useDbPropsCtx } from '@/app/_context/DbProps';
import { filter } from '@prisma/client';
import ENV from '@/lib/env';
import useCookies from '@/app/_hooks/useCookies';
import Link from 'next/link';
import ModalComponent from '../general/Modal';

export default function UserFilterModal() {
  const { filters, toggleFilterFavorite } = useDbPropsCtx();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<filter[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');

  const hasFilters = (filters?.length ?? 0) > 0 || (searchQuery?.length ?? 0) > 0;

  return (
    <ModalComponent
      open={open}
      setOpen={setOpen}
      trigger={
        <Button variant="dropdown" className="has-[>svg]:px-0 p-0 h-fit justify-start">
          <FilterIcon strokeWidth={2} size={25} />
          My Filters
        </Button>
      }
      title="My Filters"
      description="Select a filter to continue. You can search or filter by category."
    >
      <div className="grid gap-8 py-4">
        {hasFilters && (
          <div className="flex items-center gap-4">
            <LocalSearch data={filters} setFilteredResults={setSearchQuery} className="flex-1" />
            <SelectComponent value={selectedCategory} setValue={setSelectedCategory} options={favFilterType} />
          </div>
        )}

        <ul key={JSON.stringify(filters)} className="grid gap-4">
          {hasFilters ? (
            (searchQuery || filters)?.map((filter) => {
              if (selectedCategory !== 'all' && filter.type !== selectedCategory) return null;
              return (
                <FilterItem key={filter.id} filter={filter} onToggleFavorite={toggleFilterFavorite} setOpen={setOpen} />
              );
            })
          ) : (
            <div className="text-center text-gray-400">
              <p>No filters available</p>
              <p className="text-sm">You can add a filter one the listing page</p>
            </div>
          )}
        </ul>
      </div>
    </ModalComponent>
  );
}

function FilterItem({
  filter,
  onToggleFavorite,
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filter: filter;
  onToggleFavorite: (filter: filter) => void;
}) {
  const { removeFromFilter, updateFilterLastUsed } = useDbPropsCtx();
  const q = getQueryString(JSON.parse(filter.params));
  const { setCookie } = useCookies();
  const params = new URLSearchParams(q).toString();
  const url = `${ENV.NEXT_PUBLIC_URL}/listing?${params}`;

  return (
    <div className="flex items-center justify-between p-3 gap-8 border border-gray-500/50 rounded-md">
      <div className="flex items-start gap-3">
        <div className="space-y-1">
          <div className="font-medium text-gray-300">{filter.title}</div>
          <div className="text-xs text-gray-400 flex mb-2">
            <div className="capitalize w-[65px] flex gap-1 items-center">
              <span className="flex items-center justify-center rounded-full bg-primary/10">
                {filter.type === 'Movie' ? (
                  <Film size={14} className="text-gray-400" />
                ) : (
                  <Tv size={14} className="text-gray-400" />
                )}
              </span>
              {filter.type}
            </div>
            <div className="flex gap-1 items-center">
              <Clock size={12} className="shrink-0" />
              <span>Last used: {getLastUsedText(filter.lastUsed)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground break-all">{url}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center shrink-0 text-muted-foreground">
        <Link
          href={url}
          onClick={() => {
            setCookie('t', filter.type);
            updateFilterLastUsed(filter.id);
            setOpen(false);
          }}
          className="text-[12.5px] bg-gray-900 hover:bg-gray-800 text-muted-foreground hover:text-blue-500 p-2 rounded-sm duration-200 transition"
        >
          <ExternalLink size={18} />
        </Link>
        <Button
          className="bg-gray-900 duration-200 transition hover:text-yellow-400 text-muted-foreground"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(filter);
          }}
        >
          <Star size={24} className={`${filter.isFavorite ? 'fill-yellow-400 text-yellow-500' : ''}`} />
        </Button>
        <Button
          className="bg-gray-900 duration-200 transition text-muted-foreground hover:text-red-500"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            removeFromFilter(filter);
          }}
        >
          <Trash2Icon size={24} />
        </Button>
      </div>
    </div>
  );
}
