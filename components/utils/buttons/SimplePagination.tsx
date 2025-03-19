"use client";
import type React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { updateSearchParam } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface SimplePaginationProps {
  currentPage: number;
  className?: string;
}

export default function SimplePagination({
  currentPage,
  className = "",
}: SimplePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [jumpToPage, setJumpToPage] = useState("");
  const [error, setError] = useState("");

  const handlePrevious = () => {
    if (currentPage > 1) {
      updateSearchParam({
        param: { page: (page - 1).toString() },
        router,
        searchParams,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    updateSearchParam({
      param: { page: (page + 1).toString() },
      router,
      searchParams,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();

    const pageNumber = Number.parseInt(jumpToPage, 10);

    if (isNaN(pageNumber)) {
      setError("Please enter a valid number");
      return;
    }

    setError("");
    updateSearchParam({
      param: { page: pageNumber.toString() },
      router,
      searchParams,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setJumpToPage("");
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${className}`}
    >
      <p className="text-sm text-gray-300">Current page: {page}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-10 h-10 cursor-pointer disabled:cursor-not-allowed rounded-md transition-colors
            ${
              currentPage === 1
                ? "text-gray-500 bg-gray-800 cursor-not-allowed"
                : "text-white bg-gray-800 hover:bg-gray-700"
            }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className={`flex items-center justify-center w-10 h-10 cursor-pointer disabled:cursor-not-allowed rounded-md transition-colors text-white bg-gray-800 hover:bg-gray-700`}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
        <div className="relative">
          <input
            type="text"
            value={jumpToPage}
            onChange={(e) => {
              setJumpToPage(e.target.value);
              if (error) setError("");
            }}
            placeholder="Jump to page..."
            className="h-10 w-32 sm:w-40 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none"
            aria-label="Jump to page"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-xs absolute mt-10">{error}</p>
        )}
      </form>
    </div>
  );
}
