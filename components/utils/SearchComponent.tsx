'use client';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchBar({ path = 'search', placeholder = 'Search...', className = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${path}?q=${query}`);
  };

  const clearSearch = () => setQuery('');

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-center gap-2 py-2 px-3 border border-gray-500 rounded-[7px] h-[45px] w-[92svw] md:w-[400px]',
        className,
      )}
    >
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-full focus:outline-none w-full bg-transparent text-gray-100"
      />
      {query && (
        <button type="button" onClick={clearSearch} className="text-gray-400 hover:text-white h-full cursor-pointer">
          ✖
        </button>
      )}
      <button
        type="submit"
        className="h-full px-1 bg-blue-500 text-white rounded-[4px] hover:bg-blue-600 cursor-pointer"
      >
        <Search size={18} />
      </button>
    </form>
  );
}

interface LocalSearchProps<T> {
  data: T[] | null;
  className?: string;
  placeholder?: string;
  setFilteredResults: React.Dispatch<React.SetStateAction<T[] | null>>;
}

export const LocalSearch = <T extends { title: string }>({
  data,
  className,
  placeholder = 'Search...',
  setFilteredResults,
}: LocalSearchProps<T>) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!query) {
      setFilteredResults(data);
    } else {
      if (!data) return;
      const lowerQuery = query.toLowerCase();
      const filtered = data.filter((item) => String(item?.title).toLowerCase().includes(lowerQuery));
      setFilteredResults(filtered);
    }
  }, [query, data, setFilteredResults]);

  return (
    <div
      className={cn(
        'flex items-center gap-2 py-2 px-3 border border-gray-500 rounded-[7px] h-[45px] w-[82svw] md:w-[400px]',
        className,
      )}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-full focus:outline-none w-full bg-transparent text-gray-100"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="text-gray-400 hover:text-white h-full cursor-pointer"
        >
          ✖
        </button>
      )}
      <Search size={18} className="text-gray-400" />
    </div>
  );
};
