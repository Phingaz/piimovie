'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn, updateSearchParam } from '@/lib/utils';
import { useMainCtx } from '@/app/_context/Main';
import useCookies from '@/app/_hooks/useCookies';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, totalResults, className = '' }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startTransition } = useMainCtx();
  const { getCookie } = useCookies();

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVisiblePageCount = () => {
    if (windowWidth < 768) return 4;
    if (windowWidth < 1098) return 5;
    if (windowWidth < 1330) return 7;
    return 9;
  };

  const isMobile = windowWidth < 768;
  const visiblePageCount = getVisiblePageCount();

  const getPageNumbers = () => {
    const halfCount = Math.floor(visiblePageCount / 2);
    let startPage = Math.max(currentPage - halfCount, 1);
    const endPage = Math.min(startPage + visiblePageCount - 1, totalPages);

    if (endPage - startPage + 1 < visiblePageCount) {
      startPage = Math.max(endPage - visiblePageCount + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageNumbers = getPageNumbers();
  const showFirstPageButton = pageNumbers[0] > 1;
  const showLastPageButton = pageNumbers[pageNumbers.length - 1] < totalPages;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    updateSearchParam({
      param: { page: page.toString() },
      router,
      searchParams,
      startTransition,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const perParam = getCookie('perPage') ? Number(getCookie('perPage')) : 20;
  const resultsPerPage = perParam;
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(startResult + resultsPerPage - 1, totalResults);

  return (
    <div className={`flex flex-col items-center gap-4 my-4 md:my-8 ${className}`}>
      <div className="text-sm text-gray-400">
        Showing {startResult}-{endResult} of {totalResults.toLocaleString()} results
      </div>

      <div className="flex items-center gap-1">
        {!isMobile && (
          <NavigationButton
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}
            aria-label="First page"
          >
            <ChevronsLeft size={20} />
          </NavigationButton>
        )}

        <NavigationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </NavigationButton>

        {showFirstPageButton && (
          <>
            <NavigationButton onClick={() => handlePageChange(1)}>1</NavigationButton>
            {pageNumbers[0] > 2 && (
              <span className="flex items-center justify-center w-10 h-10 text-gray-400">...</span>
            )}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <NavigationButton
            key={pageNum}
            disabled={pageNum === currentPage}
            onClick={() => handlePageChange(pageNum)}
            className={pageNum === currentPage ? 'bg-blue-500 text-white' : 'text-white hover:bg-gray-700'}
            aria-label={`Page ${pageNum}`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </NavigationButton>
        ))}

        {showLastPageButton && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="flex items-center justify-center w-10 h-10 text-gray-400">...</span>
            )}
            <NavigationButton onClick={() => handlePageChange(totalPages)}>{totalPages}</NavigationButton>
          </>
        )}

        <NavigationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </NavigationButton>

        {!isMobile && (
          <NavigationButton
            className={currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-white hover:bg-gray-700'}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            <ChevronsRight size={20} />
          </NavigationButton>
        )}
      </div>
    </div>
  );
}

const NavigationButton = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={cn(
        `flex items-center justify-center text-[13px] lg:size-8 size-5 md:size-7 rounded-[4px] transition-colors cursor-pointer disabled:cursor-not-allowed`,
        className,
      )}
    >
      {children}
    </button>
  );
};
