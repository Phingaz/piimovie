"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Search = ({ initialValue }: { initialValue?: string }) => {
  const router = useRouter();
  const [search, setSearch] = React.useState(initialValue || "");
  const [error, setError] = React.useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() === "" || search.trim().length < 3) {
      setError(true);
      return;
    }

    router.push(`/search?search=${search}&page=1`);
  };

  return (
    <form onSubmit={onSubmit} className="w-[min(500px,50vw)]">
      <input
        type="text"
        placeholder="Press enter to search"
        value={search}
        onChange={(e) => {
          setError(false);
          setSearch(e.target.value);
        }}
        className="w-full bg-transparent border border-accent-brighter px-3 text-sm font-[500] py-2 rounded-lg outline-0 ring-0"
      />
      {error && (
        <p className="text-red-300 tracking-wide text-xs mt-1">
          Search must be at least 3 characters long
        </p>
      )}
    </form>
  );
};

export default Search;
