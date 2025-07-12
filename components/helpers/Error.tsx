import { CircleAlert, Home } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import SectionTitle from '../utils/texts/SectionTitle';

interface ErrorComponentProps {
  error: unknown;
  title?: string;
  description?: string;
  variant?: 'page' | 'section' | 'movie-section' | 'detail' | 'inline';
  showHomeButton?: boolean;
  className?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

const UnifiedErrorComponent = ({
  error,
  title,
  description,
  variant = 'inline',
  showHomeButton = false,
  className = '',
}: ErrorComponentProps) => {
  const errorMessage = getErrorMessage(error);

  // Page-level error (full screen)
  if (variant === 'page') {
    return (
      <div className="h-[100svh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center text-gray-300">
          <div className="flex justify-center">
            <CircleAlert className="h-24 w-24 text-red-700" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">{title || 'Ooops, something went wrong!'}</h1>
          <p className="mt-2 text-sm">
            {description || 'We encountered an error trying to process your request, please try again at a later time.'}
          </p>
          <p className="mt-2 text-sm text-red-500 border rounded-md border-red-500 p-3">
            Error message: {errorMessage}
          </p>
          {showHomeButton && (
            <div className="mt-8 flex justify-center items-center gap-5 h-[40px]">
              <Link
                href="/"
                className="w-fit px-4 gap-2 border border-gray-300 h-full rounded-md flex items-center justify-center text-sm font-[500] hover:text-main/80 transition hover:bg-gray-300 hover:text-black"
              >
                <Home size={20} color="currentColor" />
                Go Home
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Section error with title
  if (variant === 'section') {
    return (
      <div className={`w-full mb-24 ${className}`}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl md:text-2xl font-[600] text-gray-300">{title}</h2>
        </div>
        <div>
          <p className="mt-2 text-sm text-red-500 rounded-md">
            {description || 'An error occurred processing this request'}
          </p>
          <p className="mt-2 text-sm text-red-500 rounded-md">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // Movie/TV section error
  if (variant === 'movie-section') {
    return (
      <div className={`w-full ${className}`}>
        <SectionTitle>
          <>{title}</>
        </SectionTitle>
        <div>
          <p className="text-sm text-red-500 rounded-md">
            {description || 'An error occurred processing this request'}: {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  // Detail view error (for movie trailer, etc.)
  if (variant === 'detail') {
    return (
      <div
        className={`w-full justify-center items-center text-red-400 text-2xl font-medium flex flex-col h-[70%] gap-5 ${className}`}
      >
        <CircleAlert className="h-20 w-20 text-red-700" />
        <span className="space-y-1 text-center">
          <p>{title || 'An error occurred loading the content'}</p>
          <p className="text-base">{errorMessage}</p>
        </span>
      </div>
    );
  }

  // Inline error (minimal)
  return (
    <div className={`text-sm text-red-500 rounded-md ${className}`}>
      {description && <p>{description}</p>}
      <p>{errorMessage}</p>
    </div>
  );
};

// Legacy exports for backward compatibility
const ErrorPageComponent = ({ error }: { error: unknown }) => (
  <UnifiedErrorComponent error={error} variant="page" showHomeButton />
);

export const ErrorSectionComponent = ({ title, error }: { title: string; error: unknown }) => (
  <UnifiedErrorComponent error={error} title={title} variant="section" />
);

export const ErrorMovieSection = ({ title, error }: { title: string; error: unknown }) => (
  <UnifiedErrorComponent error={error} title={title} variant="movie-section" />
);

export const MovieDetailError = ({ error }: { error: unknown }) => (
  <UnifiedErrorComponent error={error} title="An error occurred loading the movie trailer" variant="detail" />
);

export default ErrorPageComponent;
export { UnifiedErrorComponent };
